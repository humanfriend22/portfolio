---
title: "minecraft-ec2"
summary: "A Discord bot, cloud functions, and server scripts to run a small Minecraft server on Amazon EC2."
stack: [JavaScript, discord.js, AWS EC2, Firebase]
year: "2022"
repo: https://github.com/humanfriend22/minecraft-ec2
notable: true
weight: 2
date: 2022-10-18
---

## Overview

A collection of code for running a small Minecraft server on Amazon EC2. An always-on server costs money even when nobody is playing, so the project is built around controlling the EC2 instance from outside it. The repo is split by what each piece does:

- **`bot/`**: a Discord bot built with discord.js and the AWS SDK for EC2.
- **`functions/`**: Firebase Cloud Functions (Express, Firebase Admin, and the EC2 SDK) with scheduled Pub/Sub jobs and a database service. Commits like "add time frame restrictions" and "fix pubsub timing" come from here.
- **`pricing/`**: a script for working out what the instance costs.
- **`server/`**: scripts that run on the instance itself, including a systemd service so the server starts reliably and a helper that reports its IP.

## Where it went

The repo history runs from September to October 2022. The project later moved to a community organization, and I picked the idea up again in 2026 as [mcsd](/projects/mcsd/), a Minecraft server manager written in Go.
