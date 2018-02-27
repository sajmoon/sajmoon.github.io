webpackJsonp([0xb345eaf2611f],{515:function(e,n){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/1970-01-01-use-mock-in-elixir.md absPath of file >>> MarkdownRemark",html:'<h1>Testing an external service.</h1>\n<p>We cannot run tests against for example Amazon S3 every time we change something in our code base. It’s not practical. </p>\n<ul>\n<li>It is slow.</li>\n<li>It is not reliable; the API might be down. If the test fails, is it your fault?</li>\n</ul>\n<p>So we mock. We mock the external library or service away and what we have left is the code that actually matters to us.</p>\n<h2>Example time</h2>\n<p>We want to upload files from a website to a server. The file is to be stored in the cloud (<a href="http://aws.amazon.com/s3/">S3</a>). We might do some processing as well. A good example might be to create a thumbnail of the uploaded image. Then we should respond to the client with either <em>success</em> or <em>fail</em> message.</p>\n<h2>What do we mock?</h2>\n<p>We mock only what we cannot control, what is not our responsibility. Both APIs and external libs should already be tested by the authors. If not, you really shouldn’t use them. </p>\n<p>There is a library to work with S3 in Elixir called <a href="https://github.com/stavro/arc/">arc</a>. We should asume(or check the source and enusre that it is) that arc actually is tested and works. So what we implement mearly uses arc.</p>\n<blockquote>\n<p>Then we <em>mock a successfull response</em> from arc, and ==ensure that our application behaves accoringly==. And we mock a failure response from arc and <em>enusre</em> that our application displays the correct error messages.</p>\n</blockquote>\n<h3>Mock library for Elixir</h3>\n<p>There is tools for this, one is <a href="https://github.com/jjh42/mock">mock</a>. Internally it uses <a href="https://github.com/eproxus/meck">meck</a> which is an erlang library.</p>\n<h3>An actual test!</h3>\n<div class="gatsby-highlight">\n      <pre class="language-defmodule filezilla.uploader do"><code>  require Logger\n  alias Filezilla.ImageUpload, as: ImageUpload\n\n  def handle_file(upload) do\n    Logger.info "handle file"\n\n     Filezilla.S3.upload(upload)\n     |> handle_upload()\n  end\n\n  defp handle_upload({:ok, filename}) do\n    {:ok, filename}\n  end\n  defp handle_upload({:error, reasone}) do\n    {:error}\n  end\n\n  defp upload_file(upload) do\n    IO.inspect upload\n    path = upload\n\n\n    # upload_path = "/uploads/" <> filename\n\n    # IO.inspect path\n    # access_key_id = System.get_env("AWS_ACCESS_KEY_ID") |> String.to_char_list\n    # secret_access_key = "Simon" |> String.to_char_list #System.get_env("AWS_SECRET_ACCESS_KEY") |> String.to_char_list\n    # s3 = :erlcloud_s3.new(access_key_id, secret_access_key)\n\n    # buckets = :erlcloud_s3.list_objects(\'wolandtraveldev2\', s3)\n    # IO.inspect buckets\n\n    # log = :erlcloud_s3.get_object(\'wolandtraveldev2\', \'logs/2015-07-22-23-47-20-7D72E489B22FD59B\')\n    # IO.inspect log\n\n    # output = :erlcloud_s3.put_object(\'wolandtraveldev2\', \'key1\', \'value1\')\n    # IO.inspect output\n\n    # Hn7)UcXgmHQp\n\n    # {:ok, binary} = File.read(path)\n    # IO.inspect output\n    #\n    upload_path\n  end\nend</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>defmodule Filezilla.S3 do\n  @base_path "uploads/"\n\n  def upload file do\n      s3_filename = @base_path <> file.filename |> String.to_char_list\n\n      File.read(file.path)\n      |> send_file(s3_filename)\n        # {:ok, binary} -> send_file(s3_filename)\n  end\n\n  defp send_file({:error, msg}, _s3_filename), do: {:error, msg}\n  defp send_file({:ok, binary}, s3_filename) do\n    try do\n      s3 = authenticate\n      :erlcloud_s3.put_object(\'wolandtraveldev2\', s3_filename, binary, s3)\n      |> handle_upload(s3_filename)\n    rescue\n      RuntimeError -> {:error, ""}\n    end\n  end\n\n  defp authenticate do\n    access_key_id = System.get_env("AWS_ACCESS_KEY_ID") |> String.to_char_list\n    secret_access_key = System.get_env("AWS_SECRET_ACCESS_KEY") |> String.to_char_list\n    :erlcloud_s3.new(access_key_id, secret_access_key)\n  end\n\n  defp handle_upload([version_id: vid], file) do\n    {:ok, file}\n  end\n  defp handle_upload({:aws_error, reason}) do\n    {:error, reason}\n  end\n  defp handle_upload({:error, :enoent}), do: {:error, :enoent}\nend</code></pre>\n      </div>\n<p>Plug.Upload tests: <a href="https://github.com/elixir-lang/plug/blob/master/lib/plug/upload.ex">https://github.com/elixir-lang/plug/blob/master/lib/plug/upload.ex</a></p>\n<p>Arc uses erlcloud. See the tests: <a href="https://github.com/stavro/arc/blob/master/test/storage/s3_test.exs">https://github.com/stavro/arc/blob/master/test/storage/s3_test.exs</a></p>\n<p>erlcloud it self: <a href="https://github.com/gleber/erlcloud">https://github.com/gleber/erlcloud</a></p>\n<p>excellent short blog about erlcloud in elixir: <a href="http://blog.jordan-dimov.com/accessing-the-amazon-aws-from-elixir-using-erlcloud/">http://blog.jordan-dimov.com/accessing-the-amazon-aws-from-elixir-using-erlcloud/</a></p>',frontmatter:{title:"How to use mocking in Elixir",date:"January 01, 1970"}}},pathContext:{slug:"/1970-01-01-use-mock-in-elixir/"}}}});
//# sourceMappingURL=path---1970-1970-01-01-use-mock-in-elixir-55530a24a5a7fbdfedf0.js.map