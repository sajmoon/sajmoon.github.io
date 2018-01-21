---
title: Working with Ecto in tests
slug: working-with-ecto-in-tests
date: 2016-10-19T20:08:44.149Z
---

Working with our application and writing all those needed tests are great in the beginning of the project when everything is simple. Writing code from scratch is always a joy. 

Then comes the time when you have added validations to your model here and there and the tests starts to be more about setup then actual tests.

The setup of tests has to have a `User` to create one `Team` since we have foreign key constraints. The User needs to be valid, and we then we have to have a proper email. But we are writing tests for our `Team` and we do not care about email for the user.

The best thing to do is write tests that do not require actually digging in the database etc. We all know that. But sometimes you are either lazy, or it is actually needed.

So you think: I can create a factory (See java doc) that can take care of the creating of my models. And then you think I can find a plugin for this. And you do. If you have worked with ruby you you have heard of `FactoryGirl` and since we are writing [Elixir](http://elixir-lang.org/) now lets find something similar.

A quick search for "factory girl for elixir" gives you some good results, one is [ExMachina](https://github.com/thoughtbot/ex_machina).

And you feel dirty. "I dont wanna.." you complain.

But you code looks like this:
```
{:ok, user} = User.changeset(%User{}, %{email: "valid_email@example.com", password: "...", name: "", etc, etc) |> Repo.insert()
{:ok, team} = Team.changeset(%Team{}, %{owner: user, name: "", etc, etc}) |> Repo.insert()

```

And this is just the beginning. You have only two models interacting. So you add a new required field to user, and you have to update all tests. Or worse, another relation.

You can defined the params for user as @valid_user, or use one of those factory things.

But I just realised that you don't have to use changesets. Changesets are awesome, but in this case we don't need it.
```
{:ok, user} = %User{} |> Repo.insert()
{:ok, team} = Team.changeset(%Team{}, %{owner: user, name: "", etc, etc}) |> Repo.insert()
```

You can still validate that the team has a foreign key constraint on `creator` but without having to have a complete user.

Our `Team` still uses a changeset since that is the model we care about. And if the current action requires a proper user you should have one.

But this has helped me and is one of those small things that I should have realized before but apparently missed about Ecto.
