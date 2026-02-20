#pragma once

#include "Device.hpp"

class SmartLight : public Device {
public:
    SmartLight(std::string id);
    json generateTelemetry() override;

private:
    bool isOn;
    int brightness; // 0-100
    int colorTemp; // 2700-6500K

    void updateState();
};
