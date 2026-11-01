---
title: "fanesp"
summary: "ESP32 firmware that speaks a ceiling fan remote's Bluetooth protocol, so it can be controlled from Home Assistant."
stack: [C++, ESP-IDF, ESP32, BLE]
year: "2026"
repo: https://github.com/humanfriend22/fanesp
date: 2026-05-06
---

## Overview

Many ceiling fans and lamps are controlled by a phone app or a remote that broadcasts commands over Bluetooth Low Energy advertising. fanesp is C++ firmware for an ESP32, built with Espressif's ESP-IDF, that sends those commands, so the fan can be driven from [Home Assistant](/projects/garage-opener/) instead.

It builds on the protocol work in the open-source [ha-ble-adv](https://github.com/NicoIIT/ha-ble-adv) integration, and the repo includes a codec reference for the fan protocols it supports.
