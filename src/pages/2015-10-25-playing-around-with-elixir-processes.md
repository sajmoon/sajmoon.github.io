---
title: Playing around with Elixir Process
slug: playing-around-with-elixir-processes
date: 2015-10-25T14:35:00.000Z
---

# Elixir and Process

In Erlang and Elixir we talk about process the way you would talk about threads in some other language. They are not system process. You cannot see them using `ps` or `top`. They are managed and created by the Erlang VM.

And the Erlang VM is pretty good at managing them.

## Create a process
```language-elixir
iex(1)> pid = spawn(fn -> IO.puts "im alive" end)
im alive
#PID<0.61.0>

iex(3)> Process.alive? pid
false
```

So we spawned a process with the job to execute the anonymous function we passed to it, and then it quit.
Cool. What else can we do?

## Why send messages?
A big part of what makes the Erlang concurrency model so great is the use of messages. By starting a processes to do one thing and then communicate with that process through messages you have built a system that scales very easily to be global. We don't really care that the process we are sending a message to is a local process. It could just as easily be in some datacenter on the other side of the world. No worries. We build a system ready to be scaled.

## How to send messages.
A message is sent either to a `pid`(process id) or to a named process. Lets start by sending messages to a pid.

Start iex.
```language-elixir
iex(1)> self
#PID<0.57.0>
iex(2)> send(self, "hello")
"hello"
iex(3)> flush
"hello"
:ok
```

Self returns the pid of the process we are in now. In this case iex itself.
Send takes two parameters, a `pid` and the message.
We have not yet configured our process to listen for messages, but a short hand is to `flush` the mailbox for the current process. That will list all messages received.

Alright. Sending and flushing all done.

## Receiving messages
So if processes talks through messages we need a way to send and listen to messages that is being sent around.

Let's create a small `Worker` process. Create a file called `processes.ex`.

```language-elixir
defmodule ElixirTest.BasicWorker do
  def loop do
    receive do
      {sender_pid, _} ->
        send(sender_pid, {:ok, :pong})
        loop
    end
  end
end
```
It is just a echo service.

How to use it then?

```language-elixir
iex(1)> c("processes.ex")
```
Compiles the file so we can use the modules from iex. Then spawn a process. Remember to save the pid.
```language-elixir
iex(2)> pid = spawn(ElixirTest.BasicWorker, :loop, [])
#PID<0.74.0>
```

After that send a message to it and check the `mail box`, lacking a better term.
```language-elixir
iex(3)> send(pid, {self, :ok})
{#PID<0.57.0>, :ok}
iex(4)> flush
{:ok, :pong}
:ok
```

Awesome. Our process replied. We could just keep on sending messages.

```language-elixir
iex(18)> send(pid, {self, :ok})
{#PID<0.57.0>, :ok}
iex(19)> send(pid, {self, :ok})
{#PID<0.57.0>, :ok}
iex(20)> flush
{:ok, :pong}
{:ok, :pong}
:ok
```

And since everything Elixir is pattern matching we could send very specific messages.

## What about async?
What processing a message takes some time? Think a costly http request or some calculations, will the iex prompt freeze? Let's see.

Modify your worker to include a delay to simulate some heavy work.
```language-elixir
defmodule ElixirTest.BasicWorker do
  def loop do
    receive do
      {sender_pid, _} ->
        :timer.sleep(1000)
        send(sender_pid, {:ok, :pong})
        loop
    end
  end
end
```

Reload or recompile the module.
```language-elixir
iex(21)> r(ElixirTest.BasicWorker)
```

And try it out!

```language-elixir
iex(26)> send(pid, {self, :ok})
{#PID<0.57.0>, :ok}
iex(27)> flush
:ok
iex(28)> flush
{:ok, :pong}
:ok
```

The first flush has not received any message from your process but still you are free to keep on doing stuff.

This is not weird or anything special. `send` have to be async, otherwise whats the point? But it's good to be sure.

## Sending messages to a dead process
Everything dies. So how would send behave if the process died?

Let us kill it.

```language-elixir
iex(31)> Process.exit(pid, :kill)
true
iex(32)> Process.alive? pid
false
iex(33)> send(pid, {self, :ok})
{#PID<0.57.0>, :ok}
```
We can still send messages. `send` doesn't wait for a replie so if the process is listening or not doesn't really matter.

```language-elixir
iex(35)> flush
:ok
```

After a flush we can see that nothing has been sent to our iex process. Well, the worker is dead so that is to be expected.

## Kill iex

Iex, our interactive elixir console, is just a process as anything else. We know the pid. So we can do stuff with it, like kill it.
```language-elixir
iex(40)> self
#PID<0.57.0>
iex(41)> Process.exit(self, :exit)
** (EXIT from #PID<0.57.0>) :exit

Interactive Elixir (1.1.1) - press Ctrl+C to exit (type h() ENTER for help)
iex(1)> self
#PID<0.23081.0>
```

It restarted it self.

That is not true, but it was restarted. We got a new pid, so it is not the same process.

The iex is part of an application, which has a supervisor. Supervisors have one job, and that is to handle crashed processes. We can see our current supervisor tree and the applications running on our BEAM.

```language-elixir
iex(4)> :observer.start
:ok
```
A gui application will start, where you can browse around and do stuff.

Click the tab Applications and you will see iex listed to the left. The graph shows the tree of processes for that application.

You will see a Supervisor. Klick on that blob and in the menu select Kill. You will see it does not come back.

In the running iex we see a message:
```language-elixir
iex(5)>
23:21:16.631 [info]  Application iex exited: killed
```

Killed and closed.

### What do we know about our process?

Restart iex and spawn one of our small workers. We will use `Process.info` to learn something about it.
```language-elixir
iex(2)> pid = spawn(ElixirTest.BasicWorker, :loop, [])
#PID<0.68.0>
iex(3)> self
#PID<0.57.0>
iex(4)> Process.info(pid)
[current_function: {ElixirTest.BasicWorker, :loop, 0},
 initial_call: {ElixirTest.BasicWorker, :loop, 0}, status: :waiting,
 message_queue_len: 0, messages: [], links: [], dictionary: [],
 trap_exit: false, error_handler: :error_handler, priority: :normal,
 group_leader: #PID<0.26.0>, total_heap_size: 233, heap_size: 233,
 stack_size: 2, reductions: 1,
 garbage_collection: [min_bin_vheap_size: 46422, min_heap_size: 233,
  fullsweep_after: 65535, minor_gcs: 0], suspending: []]
```

Lots of information! We can see what the process is doing right now with the `current_function` and `status`. We can see messageges waiting to be processed. We can see the __heap size__ and more memory information.

Set the delay in our worker to something long, 20 seconds or so. Send 4 messages or so to the process. Check the info now.

```language-elixir
iex(10)> send(pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(11)> send(pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(12)> send(pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(13)> send(pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(14)> send(pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(15)> Process.info(pid)
[current_function: {:timer, :sleep, 1},
 initial_call: {ElixirTest.BasicWorker, :loop, 0}, status: :waiting,
 message_queue_len: 4,
 messages: [{#PID<0.57.0>, :ping}, {#PID<0.57.0>, :ping}, {#PID<0.57.0>, :ping},
  {#PID<0.57.0>, :ping}], links: [], dictionary: [], trap_exit: false,
 error_handler: :error_handler, priority: :normal, group_leader: #PID<0.26.0>,
 total_heap_size: 233, heap_size: 233, stack_size: 4, reductions: 5,
 garbage_collection: [min_bin_vheap_size: 46422, min_heap_size: 233,
  fullsweep_after: 65535, minor_gcs: 0], suspending: []]
```

The process now have ___message_queue_len: 4__, meaning it has messages waiting. Since the process only handles one message at a time, the messages to iex will come at 20seconds intervals.

### Parallell process
So we found a problem. Our worker is async. But it does not do work in parallell. This will definitely be a problem. To solve this we create a server which only has one job. Listen to messages, and for each message start a worker process that handles the heavy calculations (:timer.sleep in our case).

Show me some code!

```language-elixir
defmodule ElixirTest.BasicWorker do
  def execute sender_pid do
    :timer.sleep(10000)
    send(sender_pid, {:ok, :pong})
  end
end

defmodule ElixirTest.BasicServer do
  def loop do
    receive do
      {sender_pid, _} ->
        worker_pid = spawn(ElixirTest.BasicWorker, :execute, [sender_pid])
        loop
    end
  end
end
```

For each message the server spawns a worker that does all the calculations and after sends a message to our iex pid.

```language-elixir
iex(7)> send(server_pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(8)> send(server_pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(9)> send(server_pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(10)> send(server_pid, {self, :ping})
{#PID<0.57.0>, :ping}
iex(11)> Process.info(server_pid)
[current_function: {ElixirTest.BasicServer, :loop, 0},
 initial_call: {ElixirTest.BasicServer, :loop, 0}, status: :waiting,
 message_queue_len: 0, messages: [], links: [], dictionary: [],
 trap_exit: false, error_handler: :error_handler, priority: :normal,
 group_leader: #PID<0.26.0>, total_heap_size: 233, heap_size: 233,
 stack_size: 1, reductions: 1149,
 garbage_collection: [min_bin_vheap_size: 46422, min_heap_size: 233,
  fullsweep_after: 65535, minor_gcs: 0], suspending: []]
iex(12)> flush
:ok
```
No messages in the queue. All have been processed. Or started at least. We still haven't received any messages. Wait around 10 seconds and the messages should start to come in.

```language-elixir
ex(15)> flush
{:ok, :pong}
{:ok, :pong}
:ok
```

Cool. So we built a async worker, which didn't do any work in parallel. Then we modified it with a dispatcher and it got some parallel super powers.
