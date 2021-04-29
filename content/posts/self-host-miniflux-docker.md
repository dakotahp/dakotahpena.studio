---
title: "Make Less Data: Self-Host Miniflux Feed Reader"
date: 2021-04-28T19:16:46-07:00
draft: false
menu: "blog"
categories: ["Tech"]
tags: ["self-hosting", "docker", "off the grid", "privacy", "Make Less Data"]
---

_This is the first in [a series about self-hosted services](/tags/make-less-data/) that you can run yourself in order for you to be less of a product of other companies.  This means you will be creating less marketable data for these companies and likely saving money in the process._

The shutdown of Google Reader years ago sent ripples across the internet as there was now room for competition in the form of small, paid feed reading services like Feedbin. Having been a customer of Feedbin for several years and being happy with it, I nevertheless decided to explore options for self hosting an RSS reader service as an exercise of being more self sufficient. It is even more incentive that as more apps and services become subscription-based, I wanted to reduce my growing number of recurring software subscriptions as much as possible.

While there will be many different open source web applications that can be chosen from, I decided on [Miniflux](https://miniflux.app/) due to its focus on minimalism and simplicity feature-wise without being austere or ugly. Another benefit is that being written in Go, it means the interactions are near instantaneous. Finally, you can subscribe to YouTube channels to reduce being tracked by Google because it uses the more private `youtube-nocookie.com` domain for the video player.

## Docker Overview

If you don't already have Docker installed you will need to [install it](https://www.docker.com/products/docker-desktop) first. It is available for many operating systems and can be installed headless with package managers like homebrew, apt, and others.

_Docker is similar to a virtual machine on your computer or server. It allows for containment of code and services so you don’t have to install, say, a database directly on your computer. It runs contained and is configured through a `docker-compose.yml` with little effort._

By using Docker, and Docker Compose in particular, we can avoid having to manage servers and let the configuration file (`docker-compose.yml`) handle it for us in a consistent and stable way.

## Miniflux Setup

Create a directory and add file called `docker-compose.yml` with the following contents.

```yaml
version: '3'
services:
  miniflux:
    image: miniflux/miniflux:latest
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgres://miniflux:secret@db/miniflux?sslmode=disable
  db:
    image: postgres:latest
    env_file:
      - .env
    volumes:
      - miniflux-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "miniflux"]
      interval: 10s
      start_period: 30s
volumes:
  miniflux-db:
```

Next, create a hidden file named `.env` to store secret values for the database credentials.

```env
POSTGRES_USER=miniflux
POSTGRES_PASSWORD=secretpassword

RUN_MIGRATIONS=1
CREATE_ADMIN=1
ADMIN_USERNAME=admin
ADMIN_PASSWORD=test123
```

Change the value of `POSTGRES_PASSWORD` to something more random and password-like. The latter values will run database migrations and create an administrator user with the specified username and password, respectively. You can leave the password as-is because you can change it later in the app.

## Fire it Up

Now you can start everything up with `docker-compose up -d` where the `-d` will start the containers in daemon mode in the background. If you need to see the output then run the command _without_ `-d`.

You should be able to try out Miniflux at `http://localhost:8080` and log in with the credentials in your `.env` file. Don't forget to change your password.

If all goes well you will be up and running with Miniflux and be able to start adding RSS and Atom feeds to it and even YouTube channel URLs. If you have any trouble you can refer to the [official documentation](https://miniflux.app/docs/installation.html#docker).

## Clean Up

You can now clean up your `.env` file by removing `CREATE_ADMIN`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` since those are temporary. Technically you can remove `RUN_MIGRATIONS` but if you later update Miniflux it will need to run migrations again and it doesn't hurt to leave it in.

Speaking of `.env`, the instructions here differ from the original instructions in that I prefer the use of a separate file with these secret values whereas the official documentation expect you to put these values directly in the `docker-compose.yml` file. This is not ideal because you can accidentally put sensitive values into this file and accidentally commit it to version control.

The final caveat relates to the port 8080 used:

```yaml
ports:
	- "8080:8080"
```

The port values start from the outside in with the first `8080` representing what is exposed to your system. If you were to change it to `3000` it would look like `"3000:8080"` and be available at [http://localhost:3000](http://localhost:3000). Lower number ports like 80 (which would allow [http://localhost/](http://localhost/) are privileged ports on most systems and require hoops to jump through to get working.

If you insist on using port 80 then the easier option is adding a reverse proxy web server in front of it like [Caddy](https://caddyserver.com/) or [Nginx](https://nginx.org/en/) but this is beyond the scope of this article.

## Summary

You should now have Miniflux running on the machine you chose to install it on. It is fine to run on your personal computer but running it on a separate server (Raspberry Pi, Synology, VPS) is a nice upgrade because you can access it from anywhere, provided you have a domain name to use.

More importantly, you are now more self-sufficient and generating less marketable data for other services to track you from.
