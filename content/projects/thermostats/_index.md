---
title: "ESP32 Thermostats"
summary: "Replacing my home's thermostats with ESP32 boards at half the cost of a commercial thermostat."
stack: [ESP32, ESPHome, Home Assistant, Fusion 360]
year: "2026"
current: true
date: 2026-10-20
---

## Overview

I got tired of walking to the thermostat to change it, so I wondered if I could build my own. After researching how existing thermostats work, I settled on an **ESP32**, a **relay board**, an **AC-to-DC converter**, a **2.5" LCD touchscreen**, and a **temperature sensor**: all for about half the cost of a commercial thermostat.

## How it's going

- **Firmware:** I'm running ESPHome on the ESP32 and hooked everything up on the bench to test it.
- **Checking my research:** to confirm what I'd read about HVAC wiring standards, I manually jumped the wires behind a thermostat before trusting the design.
- **Enclosure:** I'm designing a custom 3D-printed enclosure in Autodesk Fusion 360.

## What I learned

How AC and DC voltage differ, and what heat dissipation and current requirements mean in practice. Getting those wrong could damage the components or my home's transformer, so I had to design around them.

Part of the [smart-home setup](/projects/garage-opener/) I run on Home Assistant.
