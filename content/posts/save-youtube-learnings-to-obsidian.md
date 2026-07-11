---
title: "Save YouTube Video Learnings to Obsidian"
date: 2026-07-11T09:05:32-07:00
draft: false
menu: "blog"
categories: ["Tech"]
tags: ["AI", "Claude Code", "Obsidian", "second brain", "productivity"]
description: "A Claude Code skill that downloads a YouTube video's audio, transcribes it locally, and files a summarized note into Obsidian so the learning actually sticks."
---

I use the note-taking app Obsidian for my personal organization needs, and over time I've been building it to function as a second brain. Since Obsidian is built around markdown files on the file system, there's no vendor lock-in, and it's very easy to use with AI models for reading and writing to it. This has led me to optimize how I retain information that I want to remember.

Occasionally, I'll watch an inspiring YouTube video that teaches me something useful. Bookmarking the link is futile because no knowledge is retained, and I would almost never go back into my bookmarks and watch it again. The experience was mostly ephemeral. Not wanting interesting content to be transitory, I set out to build a skill that distills the learning from the video's audio into an Obsidian note that's easy to re-read in the future. The cleaned-up note becomes part of my knowledge base to inspire me and help me learn from the content.

Doing this requires a few local CLI tools:

- To download an audio file from a YouTube video link, I use [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).
- To process the audio files slightly, I use [`ffmpeg`](https://www.ffmpeg.org/)/`ffprobe`.
- To convert audio into a transcription, [`whisper.cpp`](https://github.com/ggml-org/whisper.cpp) is what I landed on.
- A transcript from a video is something, but a summary of that transcript would be far more useful, and Claude Code does this work at the end.

## The Skill

My skill named `/capture-video` to take the YouTube video URL, coordinate these various tools, and save the summarized note in my Obsidian vault in the appropriate area automatically.

The skill's workflow involves first calling `yt-dlp` to extract an audio file from the link into a temp directory. Then, `ffmpeg` splits the audio into separate files on silences to work around buggy transcription model behavior that goes haywire when it encounters pauses. Ideally, this wouldn't be necessary if Whisper-based models were fixed, but alas, it ensures transcription quality without "thank you" repeated a hundred times. Next, the audio files are passed to `whisper.cpp` to run the dictation model and produce a text transcription. Finally, the transcription alone isn't enough to save, since it wouldn't read very well, so Claude is asked to summarize it into something easy to read in the future.

With the nice summary, future Obsidian vault functionality can resurface the note by inspiring me based on how it's tagged, or I can dig it up myself to keep it in my mental model.

## Example

The video that prompted me to stop letting valuable lessons pass by without being retained was about [moving past small talk](https://www.youtube.com/watch?v=elFdkfSNlpE) to get more depth in conversations. I've never quite put effort into doing this consistently, and wanted to remember it for life by putting it into practice. While the 8-minute video is engaging, below is the summarized note from my skill, which is much easier to revisit from time to time.

```markdown
# Moving Past Small Talk

**High, Low, Buffalo** — framework for skipping small talk via conversational threading (notice/expand on details the other person shares, give answers detailed enough to open multiple paths).

- **High** — something going well for you
- **Low** — something not going well
- **Buffalo** — something interesting about you

How it works:
- Introduce the game briefly when meeting someone new, then ask if they want to play
- You go first, sharing all three (high/low/buffalo) — this opens three threads to pick up on
- Other person takes their turn sharing their own high/low/buffalo
- Conversation naturally branches from whichever thread seems most interesting
```

[Check out my skill](https://github.com/dakotahp/dotfiles/blob/e6306b24df33905bc74ddc0fe564a5872037f4c0/dot_config/claude/skills/capture-video/SKILL.md) and use it as inspiration to rebuild for your own specific use case.
