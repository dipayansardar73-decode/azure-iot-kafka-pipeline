#pragma once

#include "Device.hpp"

class SmartFan : public Device {
public:
    SmartFan(std::string id);
    json generateTelemetry() override;

private:
    float currentRpm;
    float targetRpm;
    float temperature;
    bool isOn;
    
    void updateState();
};
