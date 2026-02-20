from confluent_kafka import Consumer, KafkaError
import json
import signal
import sys

running = True

def signal_handler(sig, frame):
    global running
    print('You pressed Ctrl+C!')
    running = False

signal.signal(signal.SIGINT, signal_handler)

c = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'debug-group',
    'auto.offset.reset': 'latest'
})

c.subscribe(['appliance-telemetry'])

msg_count = 0

print("Listening for messages...")
while running:
    msg = c.poll(1.0)

    if msg is None:
        continue
    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            continue
        else:
            print(msg.error())
            break

    msg_count += 1
    if msg_count % 1000 == 0:
        print(f"Received {msg_count} messages. Last: {msg.value().decode('utf-8')[:100]}...")

c.close()
