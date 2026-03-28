---
title: "linkding-cleaner"
date: 2026-03-28T00:00:00-07:00
description: "CLI tool that audits your linkding bookmarks and archives dead links"
draft: false
categories: ["code"]
tags: ["tool", "cli"]
technologies: ["Go", "charmbracelet/bubbletea"]
resources:
- src: linkding-cleaner.png
---

A CLI tool that checks every bookmark in your [linkding](https://github.com/sissbruecker/linkding) instance for broken URLs and automatically archives any that return 404.

Runs concurrent checks with a live progress bar, supports `--dry-run` to preview what would be archived, and reports total elapsed time.

<a href="https://github.com/dakotahp/linkding-cleaner">View on GitHub</a>
