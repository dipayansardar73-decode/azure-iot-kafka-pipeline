#include "SmartFan.hpp"
#include <cmath>

SmartFan::SmartFan(std::string id) : Device(id, "SmartFan") {
    isOn = randomInt(0, 1);
    targetRpm = isOn ? randomFloat(100.0, 1000.0) : 0.0;
    currentRpm = targetRpm;
    temperature = 25.0; // Starting temp
}

void SmartFan::updateState() {
    // Simulate simple physics
    if (isOn) {
        if (std::abs(currentRpm - targetRpm) > 5.0) {
            currentRpm += (targetRpm - currentRpm) * 0.1;
        }
        temperature += 0.01; // Heat up slightly while running
        // Random fluctuation
        currentRpm += randomFloat(-2.0, 2.0);
    } else {
        currentRpm *= 0.95; // Slow down
        if (temperature > 25.0) temperature -= 0.05; // Cool down
    }
}

json SmartFan::generateTelemetry() {
    updateState();

    // Calculate power based on RPM
    float power = isOn ? (currentRpm / 1000.0f) * 50.0f : 0.5f; // Max 50W
    float vibration = (currentRpm / 1000.0f) * 2.0f + randomFloat(0.0, 0.1); 

    return json{
        {"deviceId", id},
        {"deviceType", type},
        {"timestamp", getCurrentTimestamp()},
        {"metrics", {
            {"rpm", currentRpm},
            {"vibration", vibration},
            {"temperature", temperature},
            {"power", power},
            {"status", isOn ? "ON" : "OFF"}
        }}
    };
}
