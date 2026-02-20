# Build Stage
FROM ubuntu:22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    pkg-config \
    libssl-dev \
    zlib1g-dev \
    librdkafka-dev \
    libspdlog-dev \
    nlohmann-json3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Build
RUN mkdir build && cd build && \
    cmake .. && \
    make -j$(nproc)

# Runtime Stage
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    librdkafka-dev \
    libspdlog-dev \
    && rm -rf /var/lib/apt/lists/*

ENV LD_LIBRARY_PATH=/usr/lib/aarch64-linux-gnu:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

WORKDIR /app
COPY --from=builder /app/build/DeviceSimulator .

CMD ["./DeviceSimulator"]
