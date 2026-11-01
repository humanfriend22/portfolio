---
title: "mcsd"
summary: "A Minecraft server manager written in Go."
stack: [Go, API, RCON]
year: "2026"
repo: https://github.com/humanfriend22/mcsd
date: 2026-09-07
---

## Overview

mcsd manages Minecraft server instances. The Go API covers instances, logs, server files, RCON, and snapshots, and each instance has its own config file (the reasoning is recorded in an architecture decision record in the repo's `docs/adr` folder). I started running Minecraft servers in 2022 with [minecraft-ec2](/projects/minecraft-ec2/), a Discord bot and cloud functions for a small server on Amazon EC2.
