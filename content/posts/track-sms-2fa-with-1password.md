---
title: "Keep Track of Where You Use SMS 2FA"
publishDate: 2021-08-01T20:48:55-07:00
draft: false
toc: false
categories: ["Productivity"]
tags: ["1password", "sms", "2fa", "two-factor-auth", "phone-numbers"]
description: "Keep track of which services use SMS two-factor auth."
---

If I can make a blanket recommendation, you should be using two-factor authentication for any website or online service that provides it. No matter what that second factor is, be it SMS, one-time passcode, or security key, it decreases the likelihood of your credentials being compromised.

Unfortunately, the majority of services only provide two-factor authentication (2FA) using the SMS method by texting you the temporary code. By having your phone number be one of the critical pieces to get access to parts of your digital life, changing your phone number becomes a terrifying prospect.

## Going Through Changes

It isn't every day that somebody changes their phone number. But the usual rigamarole pales in comparison to accidentally being locked out of critical services. Google, for instance, has absolutely no fallback methods of verifying your account and I was forced to de-register my Nest devices and create a new account.

## 1Password to the Rescue

If you use a password manager like [1Password](https://1password.com/), and you _should_, you can add tags to each login that uses SMS 2FA to quickly identify these services that will need to have the 2FA disabled prior to changing your phone number, lest you lose access to them.

<img src="/img/posts/2021-08/1password@2x.png" title="Screenshot of 1Password with login tagged sms-2fa" />

While it may seem like more work than is necessary, you may thank your future self if you ever need to suddenly change your phone number. Furthermore, 2FA increases your security online while also increasing the chances of irrecovably losing access to your information. Treating it with respect and doing everything you can to never lose access to any of your authentication factors (e.g. password, SMS codes, TOTP codes) will serve you well.

_Postscript: You can do a similar thing by tagging any logins that use a security key such as a Yubikey. If you were to lose one or more of your Yubikeys then you have a manifest of all services that are using them._
