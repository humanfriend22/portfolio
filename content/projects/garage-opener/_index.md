---
title: "Garage Opener Mod"
summary: "Modified ratgdo32 firmware so my family can control the garage from anywhere through Home Assistant."
stack: [ESP32, ratgdo32, Home Assistant, Raspberry Pi]
year: "2026"
date: 2026-10-18
---

## Overview

Walking out to the garage to check or control it was inconvenient, so I added it to my home automation. **ratgdo32** is an existing DIY PCB that speaks the garage opener's protocols. I modified its firmware so the light turns on when an infrared sensor triggers, then integrated it into **Home Assistant** running on a Raspberry Pi. My family can now control the garage from anywhere.

Related: the [ESP32 thermostats](/projects/thermostats/), my [BLE ceiling-fan controller](/projects/fanesp/), and [macha](/projects/macha/), which feeds my Mac's state into the same Home Assistant.
