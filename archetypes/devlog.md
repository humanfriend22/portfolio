---
title: '{{ replace (.File.ContentBaseName | replaceRE `^[0-9]{4}-[0-9]{2}-[0-9]{2}-` "") "-" " " | title }}'
date: {{ .Date }}
---

Write what you did, what broke, what you learned.
