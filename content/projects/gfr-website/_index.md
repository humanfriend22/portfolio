---
title: "GFR Website 2.0"
summary: "A fullstack Nuxt and Firebase site with an admin panel, built for my robotics club."
stack: [Nuxt 4, Vue, Firebase, TailwindCSS]
year: "2025"
repo: https://github.com/humanfriend22/gfr-website
site: https://gaelforcerobotics.com
notable: true
weight: 1
date: 2025-08-15
---

## Overview

Gael Force Robotics has a decade of success, a clear brand, and a great domain, but when I joined the website was a landing page that didn't match any of that. The previous version was static: only developers could change its data. Over the summer of 2025 I rebuilt it from scratch as a dynamic app, taking design inspiration from the original. By August it was live, club members were signing up, and the officer board was filling in the dashboard.

It isn't a revolutionary product, but it was the first time I shipped something real that other people depend on. I wanted to build things that are useful, and this was the first one that was.

## What I built

- **Landing page control:** presidents edit the site-wide banner, the main image, the Programs section, and the steps of the Join Us section.
- **Officers page:** each officer sets their profile picture and writes about their goals for the board.
- **Team pages:** captains edit their team's roster, name, logo, and social links.
- **Blog:** officers write posts in Markdown with a cover image plus up to five supplementary images, hosted in the site's file storage.
- **Sponsors page** dedicated to the people who support the club.

## Under the hood

- **Nuxt 4** (I started on 3) with **TailwindCSS 4**.
- **Firebase:** Google sign-in for authentication, Firestore for data, Storage for images, Hosting, and a Cloud Function that creates a user document on signup. I developed against the Firebase emulators, with a script to seed them.
- **VEX Events API** to pull team competition and award data into team pages.
- **GitHub Actions** auto-deploys on every push. The repository has 137 of my commits.
