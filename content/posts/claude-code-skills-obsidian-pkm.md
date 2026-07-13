---
title: "Claude Code Skills for Obsidian Personal Knowledge Management"
date: 2026-07-12T09:10:00-07:00
draft: false
menu: "blog"
categories: ["Tech"]
tags: ["AI", "Claude Code", "Obsidian", "PKM", "second brain", "productivity"]
description: "A set of Claude Code skills and Obsidian conventions, CLAUDE.md, agent-context frontmatter, and session logging, that give an AI agent real continuity across sessions instead of starting from zero every time."
---

Taking notes somewhere is a great way to augment your brain's memory with an external storage location. The term Personal Knowledge Management (PKM)[<sup>[1]</sup>](#cite_note_1) is becoming more common to describe the new era beyond flat notes that require digging up now that AI is possible to combine with one of these note-taking systems. It is now possible to store information that can be recalled, parsed, and reasoned about, versus in the past when note-taking was more input than output due to the effort to search and dig up old notes. Having a virtual brain connected to your personal notes creates a new era of memory and learning. To manage this, I have created a set of agent skills for Claude that create a consistent workflow for using Claude Code with my notes effectively.

I use Obsidian to organize notes and information because of the way it stores notes on disk as markdown files, which does not lock you into a vendor like Evernote or Notion. If you get sick of Obsidian, you don't need to export anything. Obsidian provides a CLI[<sup>[2]</sup>](#cite_note_2) that AI agents like Claude Code can use to natively interact with your Obsidian notes, referred to as a vault. 

My own vaults are organized based on the PARA structure[<sup>[3]</sup>](#cite_note_3) from Tiago Forte, which is derivative of the Getting Things Done methodology. It is based on a folder structure of the following root level directories: `0_Inbox`, `1_Projects`, `2_Areas`, `3_Resources`, `4_Archive`. Obsidian has a lot of functionality around note organization *without* the file system and folders, and I do use some of that, but the file system foundation is how I prefer to start with organizing my information. All that said, this article does not lend itself heavily to my folder structure, so there is no requirement that the following be done under the same vault format. 
## Primary Concepts

### Context

AI agents currently have no effective memory; every prompt is starting over from nothing. Manually providing necessary context every time I need to do something is too onerous to make myself productive.

The first layer of automating context, so an AI agent knows what is going on from the beginning of a session, starts with having a `CLAUDE.md`[<sup>[4]</sup>](#cite_note_4) or equivalent file in the root of your Obsidian vault. This file needs to explain what the purpose is for the directory, your organization conventions, and, in my case, what the vault structure is with an explanation of the PARA foundation. Since the file is loaded at the beginning of every session, it gives the agent the basic overview to get its bearings. `CLAUDE.md` files, and the equivalents, are not supposed to have too much content in them because they are sent to the model for _every_ prompt you give in a session. Therefore, it's inefficient and incorrect to over-use the file with detailed information about everything in your notes. That requires another approach. 

The next layer is having greater control over context that the agent should have from arbitrary locations in your vault. If you want the agent to know about specific projects you're working on, or some baseline personal information about yourself to inform decision-making, for example, this is how to do it. Obsidian notes can have YAML frontmatter and I have an `agent-context` frontmatter key that can have possible values of either `vault` or `project` to specify whether a note is global or project-level context. Vault-level context is ingested at the beginning of every session _once_ to give the agent a basic understanding of the lay of the land. My vault has this on a few of my projects, some personal context, and other summarizations I have set up that inform any arbitrary session. This usage is kept lean, and project-level context is used for deeper context that is only loaded when working on a project. The raw YAML that goes into the note looks like the following:

```yaml
---
agent-context: vault
---
```

The `CLAUDE.md` and two types of context give a lot of capability to provide context to the agent, while giving the flexibility to easily adjust context as my notes evolve.
### Working a Project

I add arbitrary notes manually to my Obsidian vault from time to time. But the primary use case that the Obsidian plus Claude Code combo enables is working on a project. I define working a project as a session where the agent is used to parse or produce some kind of output, not necessarily a project per se. 

What this looks like in practice is running Claude Code from within one of the folders in my vault to work on something. Any file within that folder with the `agent-context` set to `project` is then read to inform the agent of the particulars of the folder's contents. Project-level context is often much deeper and can involve reading multiple files to really hit the ground running in the session. If Claude has any output, it writes out a file to the directory using the Obsidian CLI and the file instantly becomes part of the vault.

Having control over what the agent knows about a particular folder is a powerful advantage from the usual start-from-zero. If you do nothing else, a brief CLAUDE.md with vault- and project-level agent-context frontmatter will go a long way. Once you start using notes with Claude for big projects, you'll notice that the starting context only goes so far without a little more continuity between sessions.
### Session Logging

A project can be big enough to need the value of some memory between sessions beyond the project overview context previously described. A project overview cannot reasonably be the most up-to-date information unless it is constantly maintained. A project is always in flux and, without information from each session, it is not clear how the state is progressing or when the project is going in a new direction. 

Instead, a concept of logging out session information is needed. It involves a "Session Logs" folder within each project's folder, when required, that contains date-stamped notes that give an overview of a session, including a summary of the purpose of the session, decisions made, takeaways, and files modified. An example of the directory would look like the following:

```
.
├── Session Logs
│   ├── 2026-04-24-16_11-gtm-sales-pricing-fundamentals.md
│   ├── 2026-04-29-12_37-technical-details-and-persona-guides.md
│   ├── 2026-04-29-14_14-oncoemr-trd-and-compliance-posture.md
│   ├── 2026-05-06-07_00-discovery-strategy-pivot-and-cleanup.md
│   ├── 2026-05-06-22_05-facility-contact-identification.md
│   ├── 2026-05-07-21_29-facility-outreach-refinement.md
│   ├── 2026-05-09-14_34-claude-design-ideation.md
│   ├── 2026-05-09-21_26-rebrand-positioning-brief.md
│   ├── 2026-05-17-06_28-design-system-and-artifacts.md
```

Producing these session artifacts is too much work for a person to do manually, and also too much work to prompt ad hoc, so I made a skill `/log-project-session`[<sup>[5]</sup>](#cite_note_5) to automate it. Having a skill makes it a single command to encourage use and standardize output. The skill reasons about the entire session and gives options on what to save, and allows for overriding its suggestions.

Logged session output is fine if you *really* need to read it, but I find agent-written content is painful to read. The real benefit of logged sessions comes from an agent using them to get up to speed.

### Continue a Project

Now that there is a history of what happened in past sessions, a greater sense of the recent state of a project is possible when starting a new Claude session. When inside a vault directory for a project, I run `/continue-project`[<sup>[6]</sup>](#cite_note_6) which reads the last few session logs, and optionally accepts an integer to specify how many are loaded. Then, the agent has continuity between prior sessions, which makes it seem like a session never ended. It has a good idea about what the current trajectory is and knows where to find the recently produced work to continue whatever was started.

Sometimes, a project is more than the sum of passive signals, though. Sometimes it makes sense to formally establish the current state of a project, so an agent doesn't have to infer.

### State of a Project

If a project consists of a business idea being developed, there are many different phases that could be passively inferred, from being an operating business, a state of vetting the idea through customer discovery, and everything in between. Occasionally, I will need to run `/update-project-state`[<sup>[7]</sup>](#cite_note_7) to officially define the focus and trajectory of a project, because the number of notes related to a project can reflect an older focus while still being relevant to retain. The skill writes to the main file for the project to establish a quickly understood state for an agent or yourself to have a bearing to head as the focus can shift over time. Note that the *state* of a project is not reflective of a singular *status*, which may be something like in progress or done. State is an executive overview of what the primary focus is to be worked on.

## Conclusion

A note-taking repository like Obsidian in partnership with an AI agent provides a new era of learning and memory that was not possible in the past. A physical journal as a commonplace book[<sup>[8]</sup>](#cite_note_8) is a great, traditional way to retain knowledge while staying off of screens. Taking notes digitally without a reasoning brain involved allows for saving information for future use, but consumption of this information manually is less effective, happens more sparingly, and involves a lot of manual work. It is simply like having an old filing cabinet of information in an emergency that requires a lot of reading and mental parsing to learn from.

Instead, AI allows for your own brain to do what it does best, which is the executive function, while not trying to force too much information into it and being able to find connections between concepts better. Baseline context with CLAUDE.md and the `agent-context` frontmatter field gives a session a decent starting point of knowledge. Retaining any session's overview with `/log-project-session` gives a transitory log of a project that `/continue-project` can resume between sessions. Formally defining the state of a project with `/update-project-state` can quickly inform yourself and an agent of the main signal in all the noise.

This suite of skills with the described vault patterns is the basis of my personal knowledge management system that makes me more productive and informed than ever before. Whether your Obsidian vault has a folder structure like mine or not, the generalities of the skills will work for anyone and possibly even other note-taking systems if they have a CLI or MCP. No longer is using AI with notes an amnesic experience that discourages using an agent for all but the most demanding tasks. Instead, a Claude Code session is a more productive way I do work with Obsidian serving as the backbone. 

## References
<ol>

<li id="cite_note_1">
<a href="https://en.wikipedia.org/wiki/Personal_knowledge_management">Personal knowledge management</a>
<a href="#cite_ref_1" class="rl" title="Scroll up to reference">⤴️</a>
</li>

<li id="cite_note_2">
<a href="https://obsidian.md/cli">Obsidian CLI documentation</a>
<a href="#cite_ref_2" class="rl" title="Scroll up to reference">⤴️</a>
</li>

<li id="cite_note_3">
<a href="https://fortelabs.com/blog/para/">The PARA Method: The Simple System for Organizing Your Digital Life in Seconds</a>
<a href="#cite_ref_3" class="rl" title="Scroll up to reference">⤴️</a>
</li>

<li id="cite_note_4">
<a href="https://gist.github.com/dakotahp/3a39a1073f187b723abc5871ae1afac1">My Obsidian vault's CLAUDE.md</a>
<a href="#cite_ref_4" class="rl" title="Scroll up to reference">⤴️</a>
</li>


<li id="cite_note_5">
<a href="https://github.com/dakotahp/dotfiles/tree/bf491da3f057d4f4c176164402d2733a286d1185/dot_config/claude/skills/log-project-session">`/log-project-session` Claude skill</a>
<a href="#cite_ref_5" class="rl" title="Scroll up to reference">⤴️</a>
</li>

<li id="cite_note_6">
<a href="https://github.com/dakotahp/dotfiles/tree/bf491da3f057d4f4c176164402d2733a286d1185/dot_config/claude/skills/continue-project">`/continue-project` Claude skill</a>
<a href="#cite_ref_6" class="rl" title="Scroll up to reference">⤴️</a>
</li>

<li id="cite_note_7">
<a href="https://github.com/dakotahp/dotfiles/tree/bf491da3f057d4f4c176164402d2733a286d1185/dot_config/claude/skills/update-project-state">`/update-project-state` Claude skill</a>
<a href="#cite_ref_7" class="rl" title="Scroll up to reference">⤴️</a>
</li>

<li id="cite_note_8">
<a href="https://ryanholiday.net/how-and-why-to-keep-a-commonplace-book/">How And Why To Keep A "Commonplace Book"</a>
<a href="#cite_ref_8" class="rl" title="Scroll up to reference">⤴️</a>
</li>

</ol>
