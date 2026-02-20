import os
import psycopg2
import redis
import logging
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS

class DatabaseManager:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # InfluxDB
        self.influx_url = os.getenv("INFLUXDB_URL", "http://localhost:8086")
        self.influx_token = os.getenv("INFLUXDB_TOKEN", "my-token") # In prod use actual token
        self.influx_org = os.getenv("INFLUXDB_ORG", "iotorg")
        self.influx_bucket = os.getenv("INFLUXDB_BUCKET", "telemetry")
        
        self.influx_client = InfluxDBClient(url=self.influx_url, token=self.influx_token, org=self.influx_org)
        self.write_api = self.influx_client.write_api(write_options=SYNCHRONOUS)
        
        # Postgres
        self.pg_conn = None
        try:
            self.pg_conn = psycopg2.connect(
                host=os.getenv("POSTGRES_HOST", "localhost"),
                database=os.getenv("POSTGRES_DB", "iotdb"),
                user=os.getenv("POSTGRES_USER", "admin"),
                password=os.getenv("POSTGRES_PASSWORD", "adminpassword")
            )
            self.logger.info("Connected to PostgreSQL")
        except Exception as e:
            self.logger.error(f"PostgreSQL connection failed: {e}")

        # Redis
        self.redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            decode_responses=True
        )

    def write_metric(self, device_id, device_type, metrics):
        # Format for InfluxDB line protocol or Point
        pass # implemented in processor usually, or here helper
        
    def close(self):
        self.influx_client.close()
        if self.pg_conn:
            self.pg_conn.close()
        self.redis_client.close()
