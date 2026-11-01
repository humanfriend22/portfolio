---
title: "macha"
summary: "A small macOS background service that reports your Mac's state to Home Assistant."
stack: [Swift, MQTT, Home Assistant, Homebrew]
year: "2026"
repo: https://github.com/humanfriend22/macha
date: 2026-10-18
---

## Overview

macha runs in the background with no window or menu bar icon and reports to Home Assistant over MQTT: how many Bluetooth devices are connected (and their names), which Wi-Fi network the Mac is on, and its location as a device tracker, so Home Assistant zones work.

## Using it

It installs through my own Homebrew tap and ships a small CLI:

```bash
brew tap humanfriend22/tap
brew install macha
macha configure   # broker URL, credentials, which sensors to send
macha doctor      # checks config, permissions, broker connection
brew services start macha
```

`macha status` lists paired Bluetooth devices, and `macha run` runs it in the foreground for debugging.
