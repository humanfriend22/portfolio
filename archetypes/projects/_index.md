---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
summary: 'One sentence on what it is.'
stack: [Tool, Tool]
date: {{ .Date }}
# current: true        # shows under "Currently working on" instead of "Past projects"
# notable: true       # top section on the projects page and the home page
# weight: 1           # order within notable (lower = first)
# deda: true           # also lists it on the DEDA page (and keeps it on the home page)
# deda_only: true      # DEDA page only; hidden from the home page
# repo: https://github.com/humanfriend22/{{ .File.ContentBaseName }}
# site: https://example.com
# year: '2026'
# cover: /images/{{ .File.ContentBaseName }}.png   (put the file in static/images/)
---

## Overview

Write about the project here. Add devlog entries next to this file:
`hugo new content projects/{{ .File.ContentBaseName }}/2026-01-01-first-entry.md --kind devlog`
