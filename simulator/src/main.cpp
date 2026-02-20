#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include <chrono>
#include <csignal>
#include <atomic>
#include <memory>
#include <mutex>
#include <cstdlib>

#include <spdlog/spdlog.h>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <librdkafka/rdkafkacpp.h>

#include "Device.hpp"
#include "SmartFan.hpp"
#include "SmartAC.hpp"
#include "SmartLight.hpp"

std::atomic<bool> running{true};
std::atomic<uint64_t> messages_sent{0};

void signal_handler(int signum) {
    spdlog::info("Interrupt signal ({}) received. Stopping simulation...", signum);
    running = false;
}

// Kafka delivery report callback
class DeliveryReportCb : public RdKafka::DeliveryReportCb {
public:
    void dr_cb(RdKafka::Message &message) {
        if (message.err())
            spdlog::error("Message delivery failed: {}", message.errstr());
    }
};

void simulation_worker(std::vector<std::shared_ptr<Device>>& devices, 
                       RdKafka::Producer* producer, 
                       std::string topic,
                       int worker_id) {
    
    // reuse string for efficiency
    std::string payload;
    
    while(running) {
        auto start = std::chrono::steady_clock::now();
        int batch_count = 0;

        for (auto& device : devices) {
            if (!running) break;

            json telemetry = device->generateTelemetry();
            payload = telemetry.dump();

            RdKafka::ErrorCode resp = producer->produce(
                topic,
                RdKafka::Topic::PARTITION_UA,
                RdKafka::Producer::RK_MSG_COPY,
                const_cast<char*>(payload.c_str()), payload.size(),
                const_cast<char*>(device->getId().c_str()), device->getId().size(),
                0, NULL
            );

            if (resp != RdKafka::ERR_NO_ERROR) {
                if (resp == RdKafka::ERR__QUEUE_FULL) {
                    producer->poll(100); // Block if queue full
                    // Retry once
                    producer->produce(topic, RdKafka::Topic::PARTITION_UA,
                        RdKafka::Producer::RK_MSG_COPY,
                        const_cast<char*>(payload.c_str()), payload.size(),
                        NULL, 0, 0, NULL);
                } else {
                    spdlog::warn("Produce failed: {}", RdKafka::err2str(resp));
                }
            } else {
                messages_sent++;
                batch_count++;
            }

            // Poll periodically to serve delivery reports
            if (batch_count % 1000 == 0) {
                producer->poll(0);
            }
        }
        
        producer->poll(0);

        // Throttle to 1 second per iteration roughly
        auto end = std::chrono::steady_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
        if (duration.count() < 1000) {
            std::this_thread::sleep_for(std::chrono::milliseconds(1000 - duration.count()));
        }
    }
}

int main(int argc, char* argv[]) {
    signal(SIGINT, signal_handler);
    signal(SIGTERM, signal_handler);

    // Initialize logger
    auto console = spdlog::stdout_color_mt("console");
    spdlog::set_default_logger(console);
    spdlog::set_level(spdlog::level::info);

    // Configuration
    int device_count = 50000;
    int num_threads = std::thread::hardware_concurrency();
    if (num_threads == 0) num_threads = 4;
    
    const char* env_broker = std::getenv("KAFKA_BROKER");
    std::string brokers = env_broker ? env_broker : "localhost:9092";
    std::string topic = "appliance-telemetry";

    spdlog::info("Initializing Device Simulator...");
    spdlog::info("Target Devices: {}", device_count);
    spdlog::info("Worker Threads: {}", num_threads);
    spdlog::info("Kafka Broker: {}", brokers);

    // Kafka Configuration
    std::string errstr;
    RdKafka::Conf *conf = RdKafka::Conf::create(RdKafka::Conf::CONF_GLOBAL);
    conf->set("bootstrap.servers", brokers, errstr);
    conf->set("compression.codec", "snappy", errstr);
    conf->set("batch.num.messages", "10000", errstr);
    conf->set("linger.ms", "5", errstr);
    
    DeliveryReportCb dr_cb;
    conf->set("dr_cb", &dr_cb, errstr);

    RdKafka::Producer *producer = RdKafka::Producer::create(conf, errstr);
    if (!producer) {
        spdlog::error("Failed to create producer: {}", errstr);
        return 1;
    }

    // Create devices distributed across threads
    std::vector<std::vector<std::shared_ptr<Device>>> thread_devices(num_threads);
    
    spdlog::info("Creating devices...");
    for (int i = 0; i < device_count; ++i) {
        std::string id = "dev-" + std::to_string(i);
        int type_rnd = rand() % 3;
        std::shared_ptr<Device> dev;
        
        if (type_rnd == 0) dev = std::make_shared<SmartFan>(id);
        else if (type_rnd == 1) dev = std::make_shared<SmartAC>(id);
        else dev = std::make_shared<SmartLight>(id);

        thread_devices[i % num_threads].push_back(dev);
    }

    // Start workers
    std::vector<std::thread> threads;
    spdlog::info("Starting simulation loop...");
    
    for (int i = 0; i < num_threads; ++i) {
        threads.emplace_back(simulation_worker, std::ref(thread_devices[i]), producer, topic, i);
    }

    // Monitor loop
    auto start_time = std::chrono::steady_clock::now();
    uint64_t last_count = 0;

    while(running) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        uint64_t total = messages_sent.load();
        uint64_t current_rate = total - last_count;
        last_count = total;
        
        spdlog::info("Rate: {} msg/sec | Total: {}", current_rate, total);
    }

    // Cleanup
    spdlog::info("Stopping workers...");
    for (auto& t : threads) {
        if (t.joinable()) t.join();
    }

    spdlog::info("Flushing Kafka producer...");
    producer->flush(5000);
    delete producer;
    delete conf;

    return 0;
}
