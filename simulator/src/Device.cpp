#include "Device.hpp"
#include <ctime>
#include <iomanip>
#include <sstream>

Device::Device(std::string id, std::string type) 
    : id(id), type(type), gen(std::random_device{}()) {}

std::string Device::getId() const {
    return id;
}

std::string Device::getType() const {
    return type;
}

float Device::randomFloat(float min, float max) {
    std::uniform_real_distribution<float> dis(min, max);
    return dis(gen);
}

int Device::randomInt(int min, int max) {
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

std::string Device::getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()) % 1000;

    std::stringstream ss;
    ss << std::put_time(std::localtime(&in_time_t), "%Y-%m-%dT%H:%M:%S");
    ss << '.' << std::setfill('0') << std::setw(3) << ms.count() << "Z";
    return ss.str();
}
