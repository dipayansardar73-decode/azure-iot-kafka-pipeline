#pragma once

#include "Device.hpp"

class SmartAC : public Device {
public:
    SmartAC(std::string id);
    json generateTelemetry() override;

private:
    float targetTemp;
    float ambientTemp;
    float humidity;
    bool compressorOn;
    int fanSpeed; // 1-3

    void updateState();
};
