---
title: "The Friction Circle"
summary: "How fast can a car drive around a path? A numerical answer using Euler's method, from my calculus final."
stack: [Python, Calculus]
year: "2026"
repo: https://github.com/humanfriend22/calc-bc-final
date: 2026-05-28
---

## Overview

Freya Holmér's videos "The Beauty of Bézier Curves" and "The Continuity of Splines" stuck with me, and I kept wondering how they applied to the path-following algorithms I used in robotics. That sat for about two years as a puzzle with missing pieces.

In the last months of calculus we learned curvature and vector-valued functions, and I finally had the pieces. For my final project I answered one question in a presentation: **how fast can a car drive around a path?** [See the slides.](https://docs.google.com/presentation/d/1tYrcm1em4LGKfgUhY6GzMXg1uBSdxmzWJkZ1FByJS_E/edit?usp=sharing)

## The approach

For a week I was stuck re-parameterizing, searching for a magic integral. The breakthrough was to stop looking for one: instead I ran **Euler's method** thousands of times, both backwards and forwards along the path, to find the fastest speed the car can hold without exceeding the friction limit at any point. The solution was beautiful as a process rather than an equation.

The code is in Python and the repo history shows it evolving from an initial version with instant acceleration at the endpoints, to kinematics on a segmented curve, to linear interpolation.

## What I took away

Seeking out knowledge matters as much as learning it.
