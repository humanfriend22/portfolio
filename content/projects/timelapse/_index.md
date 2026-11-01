---
title: "Mycorrhizae Timelapse"
summary: "Six Raspberry Pi cameras that photograph plants every three hours and publish a daily timelapse."
stack: [Raspberry Pi, Python, HTML, Cron]
year: "2023"
repo: https://github.com/dhs-envirotech/timelapse
deda: true
notable: true
weight: 3
date: 2024-01-18
---

## Overview

For the Environmental Sustainability class, we compared control plants against plants treated with mycorrhizae to watch their symbiotic relationship over several weeks. I built a camera system to monitor them.

I set up **six Raspberry Pis**. Each captures a timestamped photo every three hours, compiles a video every 24 hours, and publishes the result to a website so classmates can follow along. Most of it happened in my freshman year.

## How it works

The repo turns any Raspberry Pi into a timelapse camera: a download script and a setup script install the packages and write the cron schedule that drives capture and video compilation. Setup instructions live in the club's GitHub discussions so other members could repeat it. I made 62 of the repo's commits.
