#pragma once

#include <string>
#include <nlohmann/json.hpp>
#include <random>
#include <chrono>

using json = nlohmann::json;

class Device {
public:
    Device(std::string id, std::string type);
    virtual ~Device() = default;

    virtual json generateTelemetry() = 0;
    std::string getId() const;
    std::string getType() const;

protected:
    std::string id;
    std::string type;
    std::mt19937 gen; // Mersenne Twister for random generation

    // Helper for random float
    float randomFloat(float min, float max);
    // Helper for random int
    int randomInt(int min, int max);
    // Helper for current timestamp
    std::string getCurrentTimestamp();
};
