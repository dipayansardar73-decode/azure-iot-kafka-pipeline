#include "SmartAC.hpp"
#include <cmath>

SmartAC::SmartAC(std::string id) : Device(id, "SmartAC") {
    targetTemp = 22.0;
    ambientTemp = randomFloat(24.0, 30.0);
    humidity = randomFloat(40.0, 60.0);
    compressorOn = false;
    fanSpeed = 1;
}

void SmartAC::updateState() {
    if (ambientTemp > targetTemp + 1.0) {
        compressorOn = true;
    } else if (ambientTemp < targetTemp - 1.0) {
        compressorOn = false;
    }

    if (compressorOn) {
        ambientTemp -= 0.05;
        humidity -= 0.01;
    } else {
        ambientTemp += 0.02; // House warms up
        humidity += 0.005;
    }
}

json SmartAC::generateTelemetry() {
    updateState();

    float power = compressorOn ? 1500.0 : 50.0; // 1500W compressor, 50W standby/fan

    return json{
        {"deviceId", id},
        {"deviceType", type},
        {"timestamp", getCurrentTimestamp()},
        {"metrics", {
            {"temperature", ambientTemp},
            {"targetTemperature", targetTemp},
            {"humidity", humidity},
            {"compressor", compressorOn ? "ON" : "OFF"},
            {"power", power}
        }}
    };
}
