---
title: How to use mocking in Elixir
slug: use-mock-in-elixir
date: 1970-01-01T00:00:00.000Z
draft: true
---

# Testing an external service.
We cannot run tests against for example Amazon S3 every time we change something in our code base. It's not practical. 

- It is slow.
- It is not reliable; the API might be down. If the test fails, is it your fault?

So we mock. We mock the external library or service away and what we have left is the code that actually matters to us.

## Example time

We want to upload files from a website to a server. The file is to be stored in the cloud ([S3](http://aws.amazon.com/s3/)). We might do some processing as well. A good example might be to create a thumbnail of the uploaded image. Then we should respond to the client with either _success_ or _fail_ message.

## What do we mock?
We mock only what we cannot control, what is not our responsibility. Both APIs and external libs should already be tested by the authors. If not, you really shouldn't use them. 

There is a library to work with S3 in Elixir called [arc](https://github.com/stavro/arc/). We should asume(or check the source and enusre that it is) that arc actually is tested and works. So what we implement mearly uses arc.

> Then we _mock a successfull response_ from arc, and ==ensure that our application behaves accoringly==. And we mock a failure response from arc and *enusre* that our application displays the correct error messages.


### Mock library for Elixir
There is tools for this, one is [mock](https://github.com/jjh42/mock). Internally it uses [meck](https://github.com/eproxus/meck) which is an erlang library.

### An actual test!
```defmodule Filezilla.Uploader do

  require Logger
  alias Filezilla.ImageUpload, as: ImageUpload

  def handle_file(upload) do
    Logger.info "handle file"

     Filezilla.S3.upload(upload)
     |> handle_upload()
  end

  defp handle_upload({:ok, filename}) do
    {:ok, filename}
  end
  defp handle_upload({:error, reasone}) do
    {:error}
  end

  defp upload_file(upload) do
    IO.inspect upload
    path = upload


    # upload_path = "/uploads/" <> filename

    # IO.inspect path
    # access_key_id = System.get_env("AWS_ACCESS_KEY_ID") |> String.to_char_list
    # secret_access_key = "Simon" |> String.to_char_list #System.get_env("AWS_SECRET_ACCESS_KEY") |> String.to_char_list
    # s3 = :erlcloud_s3.new(access_key_id, secret_access_key)

    # buckets = :erlcloud_s3.list_objects('wolandtraveldev2', s3)
    # IO.inspect buckets

    # log = :erlcloud_s3.get_object('wolandtraveldev2', 'logs/2015-07-22-23-47-20-7D72E489B22FD59B')
    # IO.inspect log

    # output = :erlcloud_s3.put_object('wolandtraveldev2', 'key1', 'value1')
    # IO.inspect output

    # Hn7)UcXgmHQp

    # {:ok, binary} = File.read(path)
    # IO.inspect output
    #
    upload_path
  end
end

```

```
defmodule Filezilla.S3 do
  @base_path "uploads/"

  def upload file do
      s3_filename = @base_path <> file.filename |> String.to_char_list

      File.read(file.path)
      |> send_file(s3_filename)
        # {:ok, binary} -> send_file(s3_filename)
  end

  defp send_file({:error, msg}, _s3_filename), do: {:error, msg}
  defp send_file({:ok, binary}, s3_filename) do
    try do
      s3 = authenticate
      :erlcloud_s3.put_object('wolandtraveldev2', s3_filename, binary, s3)
      |> handle_upload(s3_filename)
    rescue
      RuntimeError -> {:error, ""}
    end
  end

  defp authenticate do
    access_key_id = System.get_env("AWS_ACCESS_KEY_ID") |> String.to_char_list
    secret_access_key = System.get_env("AWS_SECRET_ACCESS_KEY") |> String.to_char_list
    :erlcloud_s3.new(access_key_id, secret_access_key)
  end

  defp handle_upload([version_id: vid], file) do
    {:ok, file}
  end
  defp handle_upload({:aws_error, reason}) do
    {:error, reason}
  end
  defp handle_upload({:error, :enoent}), do: {:error, :enoent}
end
```

Plug.Upload tests: https://github.com/elixir-lang/plug/blob/master/lib/plug/upload.ex

Arc uses erlcloud. See the tests: https://github.com/stavro/arc/blob/master/test/storage/s3_test.exs

erlcloud it self: https://github.com/gleber/erlcloud

excellent short blog about erlcloud in elixir: http://blog.jordan-dimov.com/accessing-the-amazon-aws-from-elixir-using-erlcloud/

