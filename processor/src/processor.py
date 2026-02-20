import json
import os
import logging
import pandas as pd
from confluent_kafka import Consumer, KafkaError
from influxdb_client import Point
from database import DatabaseManager

class StreamProcessor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.db = DatabaseManager()
        
        conf = {
            'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092'),
            'group.id': 'iot-processor-group',
            'auto.offset.reset': 'latest',
            'enable.auto.commit': False
        }
        self.consumer = Consumer(conf)
        self.consumer.subscribe(['appliance-telemetry'])
        
        # Buffer for aggregation
        self.buffer = []
        self.BATCH_SIZE = 1000

    def process_message(self, msg_val):
        try:
            data = json.loads(msg_val)
            # data = {deviceId, deviceType, timestamp, metrics: {...}}
            
            # 1. Real-time Cache (Redis) - Latest state
            key = f"device:current:{data['deviceId']}"
            self.db.redis_client.set(key, json.dumps(data), ex=300) # Expire in 5 mins
            
            # 2. InfluxDB - Raw Metrics
            p = Point("device_metrics") \
                .tag("device_id", data['deviceId']) \
                .tag("device_type", data['deviceType'])
            
            for k, v in data['metrics'].items():
                if isinstance(v, (int, float, bool)):
                     p = p.field(k, v)
            
            self.db.write_api.write(bucket=self.db.influx_bucket, org=self.db.influx_org, record=p)

            # 3. Buffer for Aggregation
            # Flatten dict for pandas
            flat_data = data['metrics']
            flat_data['deviceId'] = data['deviceId']
            flat_data['deviceType'] = data['deviceType']
            flat_data['timestamp'] = data['timestamp']
            self.buffer.append(flat_data)

        except Exception as e:
            self.logger.error(f"Error processing message: {e}")

    def flush_aggregations(self):
        if not self.buffer:
            return

        df = pd.DataFrame(self.buffer)
        # Convert timestamp... 
        # Calculate averages per deviceType
        # This is a placeholder for complex logic
        
        # Example: Average Temp per Type
        if 'temperature' in df.columns:
            avg_temp = df.groupby('deviceType')['temperature'].mean().to_dict()
            self.db.redis_client.set("stats:avg_temp", json.dumps(avg_temp))
        
        self.buffer = []

    def run(self):
        self.logger.info("Starting Stream Processor...")
        try:
            while True:
                msg = self.consumer.poll(1.0)
                
                if msg is None:
                    # Idle, maybe flush aggregations if time passed
                    continue
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        continue
                    else:
                        self.logger.error(msg.error())
                        break

                self.process_message(msg.value())
                
                if len(self.buffer) >= self.BATCH_SIZE:
                    self.flush_aggregations()
                    self.consumer.commit(asynchronous=True)

        except KeyboardInterrupt:
            pass
        finally:
            self.consumer.close()
            self.db.close()
