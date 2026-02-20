cmake_minimum_required(VERSION 3.17)
project(DeviceSimulator VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
file(GLOB_RECURSE SOURCES "src/*.cpp")
include_directories(include)

# Dependencies
find_package(PkgConfig REQUIRED)

# 1. Try finding packages via CMake Config (preferred for spdlog/nlohmann_json on Linux)
find_package(spdlog QUIET)
find_package(nlohmann_json QUIET)

# 2. Try PkgConfig (for rdkafka)
pkg_check_modules(RDKAFKA rdkafka++)

# 3. Manual Fallback (for MacOS/Homebrew if above fails)
if (NOT spdlog_FOUND)
    message(STATUS "spdlog not found via CMake, trying manual find...")
    find_path(SPDLOG_INCLUDE_DIR spdlog/spdlog.h HINTS /opt/homebrew/include /usr/local/include)
    find_library(SPDLOG_LIB spdlog HINTS /opt/homebrew/lib /usr/local/lib)
    find_library(FMT_LIB fmt HINTS /opt/homebrew/lib /usr/local/lib)
    if (SPDLOG_INCLUDE_DIR AND SPDLOG_LIB)
        include_directories(${SPDLOG_INCLUDE_DIR})
        set(SPDLOG_LIBRARIES ${SPDLOG_LIB} ${FMT_LIB})
    endif()
endif()

if (NOT RDKAFKA_FOUND)
     message(STATUS "rdkafka not found via PkgConfig, trying manual find...")
     find_path(RDKAFKA_INCLUDE_DIR librdkafka/rdkafkacpp.h HINTS /opt/homebrew/include /usr/local/include)
     find_library(RDKAFKA_LIB rdkafka HINTS /opt/homebrew/lib /usr/local/lib)
     find_library(RDKAFKA_CPP_LIB rdkafka++ HINTS /opt/homebrew/lib /usr/local/lib)
     if (RDKAFKA_INCLUDE_DIR AND RDKAFKA_LIB AND RDKAFKA_CPP_LIB)
         include_directories(${RDKAFKA_INCLUDE_DIR})
         set(RDKAFKA_LIBRARIES ${RDKAFKA_CPP_LIB} ${RDKAFKA_LIB})
     endif()
endif()

# Include dirs
if(nlohmann_json_FOUND)
    # nlohmann_json target usually carries include dirs
else()
    find_path(NLOHMANN_JSON_INCLUDE_DIR nlohmann/json.hpp HINTS /usr/include /opt/homebrew/include /usr/local/include)
    if(NLOHMANN_JSON_INCLUDE_DIR)
        include_directories(${NLOHMANN_JSON_INCLUDE_DIR})
    endif()
endif()

add_executable(DeviceSimulator ${SOURCES})

# Limits link libraries
target_link_libraries(DeviceSimulator PRIVATE 
    ${RDKAFKA_LIBRARIES}
    ${SPDLOG_LIBRARIES}
    pthread
)

if(spdlog_FOUND)
    target_link_libraries(DeviceSimulator PRIVATE spdlog::spdlog)
endif()
if(nlohmann_json_FOUND)
    target_link_libraries(DeviceSimulator PRIVATE nlohmann_json::nlohmann_json)
endif()

# Compile options
if(MSVC)
    target_compile_options(DeviceSimulator PRIVATE /W4)
else()
    target_compile_options(DeviceSimulator PRIVATE -Wall -Wextra -Wpedantic)
endif()
