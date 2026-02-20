#include "SmartLight.hpp"

SmartLight::SmartLight(std::string id) : Device(id, "SmartLight") {
    isOn = randomInt(0, 1);
    brightness = randomInt(50, 100);
    colorTemp = randomInt(2700, 6500);
}

void SmartLight::updateState() {
    // 1% chance to toggle
    if (randomInt(0, 100) < 1) {
        isOn = !isOn;
    }
    
    // Small fluctuations if on
    if (isOn) {
        if (randomInt(0, 10) < 1) brightness += randomInt(-5, 5);
        if (brightness > 100) brightness = 100;
        if (brightness < 0) brightness = 0;
    }
}

json SmartLight::generateTelemetry() {
    updateState();

    float power = isOn ? (brightness / 100.0f) * 9.0f : 0.0f; // 9W max

    return json{
        {"deviceId", id},
        {"deviceType", type},
        {"timestamp", getCurrentTimestamp()},
        {"metrics", {
            {"brightness", brightness},
            {"colorTemperature", colorTemp},
            {"power", power},
            {"status", isOn ? "ON" : "OFF"}
        }}
    };
}
