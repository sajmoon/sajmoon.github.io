---
title: Postfix - Redirect all outgoing mails to local user
slug: postfix-redirect-all-outgoing-mails-to-local-user
date: 2015-04-22T10:47:17.437Z
date_updated:   2015-04-22T10:48:56.785Z
tags: Development, Mail, Postfix
---

While developing an application I often have to test, and use the email feature. Either I register and use my normal email, or a dump mailbox to collect the spam from development. But you can also redirect all outgoing email from postfix to a local users mailbox.

## Start postfix
OS X ships with postfixed installed, you just have to start it.

```
sudo launchctl start org.postfix.master 
```

The command to stop it is very similar
```
sudo launchctl stop org.postfix.master 
```

## Redirect
Open `/etc/postfix/main.cf` and add the following to the end of the file.
```
canonical_maps = regexp:/etc/postfix/canonical-redirect
```

If it does not exists create `/etc/postfix/canonical-redirect` and add some regexp to it.
```
/^.*$/ username
```

This will redirect all outgoing mails to the inbox of the user specified.

Restart postfix using the stop and start command
```
sudo launchctl start org.postfix.master 
sudo launchctl stop org.postfix.master 
```

## Check inbox
With the `mail` command we see all mails.
```
$ mail
Mail version 8.1 6/6/93.  Type ? for help.
"/var/mail/simon": 1 message 1 new
>N  1 simon@Simons-MacBook  Wed Apr 22 12:33  27/1083  "http://localhost:8080: Reset Your Password"
?
```

Type '1' and hit enter to open that email.

