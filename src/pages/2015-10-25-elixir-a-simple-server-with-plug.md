---
title: "Elixir: A simple server with Plug"
slug: elixir-a-simple-server-with-plug
date: 2015-10-25T13:44:50.056Z
---

If you want to build a web service with Elixir, you are probably using some framework such as [Phoenix](http://www.phoenixframework.org/). And that is all fine. You probably should. But Phoenix does a lot of things in the background that are semi hidden from you as a developer. So it is no way to learn the inner workings of Elixir.

So by building a small, simple service, using [Plug](https://github.com/elixir-lang/plug) you could learn something.

Lets start.

## Getting started
I have some data I would like to present as an api or through a web page. So to my existing project I add the dependencies we need. `Plug`and `Cowboy`. 

```language-elixir
defp deps do
  # Excluding other dependencies.
  {:cowboy, "~> 1.0.3"},
  {:plug, "~> 1.0"},
end
```

Both Cowboy and Plug is an Erlang/Elixir application in it self. That is the Erlang/Elixir way to divide a project into modules or components. That basically means we communicate with them by sending messages to them.

It also means we have to make sure they are started.

We do that in the `def application do` block. Add both cowboy and plug. We also have to have a `mod` element. 
```language-elixir
[applications:
   [:logger, :httpotion, :cowboy, :plug],
   mod: {HexVersion.Api, []}
]
```

This tells mix how to start your application, what dependencies needs to be started etc. We are going to define a supervisor to controll our application so we need to ensure that is starts and stops as the applications starts. We do this by defining a module callback. This is `mod:`.
mod takes one tuple parameter on the form `{m, a}`. __m__ stands for Module, and __a__ for Arguments. It just tells mix to start our supervisor in HexVersion.Api.

So lets create that supervisor.

## Supervisor
A supervisor keeps track of all "workers" under it, and can restart one if it crashes. This is a standard component of the _Erlang/OTP pattern_. OTP is a way to design applications to be fault tolerant. It is a big and important aspect of both erlang and elixir.

Anyways, back to the supervisor.

```language-elixir
defmodule HexVersion.Api do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(HexVersion.Web, [])
    ]

    opts = [strategy: :one_for_one, name: HexVersion.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

Alright. We define a method `start` that is the method which will be called on boot, since we added it to the `def application do`.

At the last line of that block we run `Supervisor.start_link(children, opts)`. We create a supervisor which will keep track of all children. The children is a list of OTP compliant modules. They need to have a `start_link` function.
`opts` tells the supervisor when and how to restart crashed process. `:one_for_one` starts one process if one crashes. We could restart every process if for example they depend on each other.

Cool, we have a supervisor that starts our web worker. We do not have a web worker though.

So create a simple worker that takes a connection and responds with a 200, "ok". Simple enough. Its a good start though.

## Web Worker
This is where the plug magic comes in. 

```language-elixir
defmodule HexVersion.Web do
  use Plug.Router
  require Logger

  plug Plug.Logger
  plug :match
  plug :dispatch

  def init(options) do
    options
  end

  def start_link do
    {:ok, _} = Plug.Adapters.Cowboy.http HexVersion.Web, []
  end

  get "/" do
    conn
    |> send_resp(200, "ok")
    |> halt
  end
end
``` 

You can read more about [Plug](https://github.com/elixir-lang/plug) from the github page.

We define a route, "/" and define what should happen when that route matches. In this case we just send a response with status `200` and the text "ok".

But the `start_link` and `init` then? This is a function that tells the supervisor how to start a process of this type.

Right. Shall we test it?

Start your application.
`$ iex -S mix`

Make a request to the service.
`$ curl localhost:4000`

That request returns "ok". Awesome. If you look in your iex session you will see the logger at work.
 
```
14:06:47.973 [info]  GET /
14:06:47.974 [info]  Sent 200 in 1ms
```

It works great doing requests using the terminal. Lets try a browser.

It works! We get the correct text. Check the log from your application.

```
14:28:32.611 [info]  GET /favicon.ico

14:28:32.642 [error] #PID<0.285.0> running HexVersion.Web terminated
Server: localhost:4000 (http)
Request: GET /favicon.ico
** (exit) an exception was raised:
    ** (FunctionClauseError) no function clause matching in HexVersion.Web.do_match/4
        (hex_version) lib/hex_version/web.ex:19: HexVersion.Web.do_match(%Plug.Conn{adapter: {Plug.Adapters.Cowboy.Conn, :...}, assigns: %{}, before_send: 

... etc etc.. Removed for brevity

        (hex_version) lib/hex_version/web.ex:1: HexVersion.Web.plug_builder_call/2
        (plug) lib/plug/adapters/cowboy/handler.ex:15: Plug.Adapters.Cowboy.Handler.upgrade/4
        (cowboy) src/cowboy_protocol.erl:442: :cowboy_protocol.execute/4
```

Okey, thats a stack trace. So what happened? Well the browser did some extra requests. For example one to get the favicon. We did not have one, since the only route we have specified is `"/"` so when the browser executes the request to `"/favicon.ico"`, Plug cannot match it.

The line to look for is at the top: `(FunctionClauseError) no function clause matching in HexVersion.Web.do_match/4`.

We get the same results if we from the terminal would curl a route that we have not specified, say for example `/nope`.

```
14:32:50.334 [info]  GET /nope

14:32:50.398 [error] #PID<0.293.0> running HexVersion.Web terminated
Server: localhost:4000 (http)
Request: GET /nope
** (exit) an exception was raised:
    ** (FunctionClauseError) no function clause matching in HexVersion.Web.do_match/4
```

To fix this we need to provide a route or a matcher that takes any request that we haven't specified a matcher for. A wildcard.

```language-elixir
match _ do
  conn
  |> send_resp(404, "Nothing here")
  |> halt
end
```

Simple enough. No more stack traces.

However, still no favicon. Either we don't need a favicon (an api for example), or we just hid the problem.

There are plugs to help you serve static assets such as favicons, or .html files. Check out the plug site for more on that.

## Conclusion
Well, we got our service up and running. It is a very simple example, but it's free from Phoenix. Phoneix is easy to use and it is very good, but you might not always need it, or you might wounder what actually goes on inside it. This is whats happending. Phoneix uses Plug, and matches, and routes. It comes with a supervisor and all just wired up for you. Which is nice. But be sure you understand what actually is going on. 
