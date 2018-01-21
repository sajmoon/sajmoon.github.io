---
title: Problems deploying Phoenix to Heroku
slug: phoenix-ecto-on-heroku-2
date: 2015-04-17T18:59:35.213Z
date_updated:   2015-04-17T19:26:07.672Z
tags: Elixir, Phoenix, Heroku, Deploy
---

I tried to deploy a sample Phoenix application to Heroku so I read some blogposts about it etc. Didn't get it to work. 

There were essentialiy two probelms.

* Migrations.
* Assets.

## Preconditions
- Elixir 1.0.4
- Erlang 17.5
- Phoenix 0.11.0
- Ecto 0.10.0
- [HashNuke heroku-buildpack-elixit (*17 April 2015*)](https://github.com/HashNuke/heroku-buildpack-elixir/tree/36f2ff22d0236589256d9044091b950b7cc565d2)

## Migrations

```
heroku run ecto migrate --no-create
```
You need the `--no-create`, otherwise mix complains that the db could not be created. The error message is sort of disguised.

```bash
** (Mix) The database for repo Cronos.Repo couldn't be created, reason given: Error: You must install at least one postgresql-client-<version> package.
```

## Assets
I deployed my app, and it was just plain HTML. No css. 
Instead i got `404 NOT FOUND` for all assets.

Apperantly heroku builds and compiles the app, collects all dependencies **but** does not compile sass. So the repo you published to Heroku does not have any css at all.  Turns out that `/priv/static/css` and `priv/static/js` are included in the standard `.gitignore` for Phoenix applications.

So as a quickfix we just have to *unigore* those files. Push the new commit and voila!

However, compiled css and js in the repo is not very nice is it. I asked around abit and googled some; no solution at the moment. If you find any, let me know.
