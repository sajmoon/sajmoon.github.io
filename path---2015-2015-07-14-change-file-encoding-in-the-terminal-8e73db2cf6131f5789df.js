webpackJsonp([0xc75ddf3cadc5],{520:function(e,t){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/2015-07-14-change-file-encoding-in-the-terminal.md absPath of file >>> MarkdownRemark",html:'<h1>The problem</h1>\n<p>We have a large legacy project that we are converting from an ant build to maven and from SunAS to JBOSS. We had some problems with file encoding. Special characters, such as Swedish letters, where encoded incorrectly.</p>\n<p>So lets use the shell to help us with this.</p>\n<p>Can we list  all files of a certain encoding? Sure.</p>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>$ find . -type f -exec file --mime {} \\; | grep "charset=utf-16"\n./ship/src/main/resources/sql/load_mysql.sql: text/plain; charset=utf-8\n./ship/target/archive-tmp/fileSetFormatter.185046416.tmp/load_mysql.sql.654988221.filtered: text/plain; charset=utf-8\n./ship/target/archive-tmp/fileSetFormatter.185046416.tmp/sql/load_app_mysql.sql: text/plain; charset=utf-8\netc</code></pre>\n      </div>\n<p>This list includes everything from <code>.git/</code> to files generated by the build. </p>\n<p>We can see the encoding at the end. Lets list all encodings in our app.</p>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>find . -type f -exec file --mime {} \\; | grep "charset" | awk \'{print $3}\' | sort | uniq\ncharset=binary\ncharset=iso-8859-1\ncharset=unknown-8bit\ncharset=us-ascii\ncharset=utf-8</code></pre>\n      </div>\n<p>We can also list all files with a certain encoding.</p>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>find . -type f -exec file --mime {} \\; | grep "charset=us-ascii"</code></pre>\n      </div>\n<p>Extract the filename of all files.</p>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>find . -type f -exec file --mime {} \\; | grep "charset=iso-8859-1" | awk \'{print $1}\' | rev | cut -c 2- | rev</code></pre>\n      </div>\n<h2>iconv</h2>\n<p>List supported encodings.</p>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>iconv -l</code></pre>\n      </div>\n<p>convert a file to utf8.</p>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>iconv -f iso-8859-1 -t utf-8 ./src/main/webapp/WEB-INF/BcuLogin.properties > .src/main/webapp/WEB-INF/BcuLogin.properties2</code></pre>\n      </div>\n<p>As you can see we save a new file with the correct encoding. I could not get iconv to overwrite the original. You can ofcourse store in a temp file etc.</p>\n<p>However <code>recode</code> is another tool, and it supports overwrite.</p>\n<h2>recode</h2>\n<p>Simply converts from one encoding to the other. Overwriting the original file.</p>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>recode iso-8859-1..utf8 ./src/main/webapp/WEB-INF/BcuLogin.properties     </code></pre>\n      </div>\n<h2>Putting it all together</h2>\n<div class="gatsby-highlight">\n      <pre class="language-shell"><code>find . -type f -exec file --mime {} \\; | grep "charset=iso-8859-1" | awk \'{print $1}\' | rev | cut -c 2- | rev | parallel recode iso-8859-1..utf8 {}</code></pre>\n      </div>\n<p>This lists all of a specific encoding, parses the filename, and re-encodes it with utf8.</p>',frontmatter:{title:"Change file encoding in the terminal.",date:"July 14, 2015"}}},pathContext:{slug:"/2015-07-14-change-file-encoding-in-the-terminal/"}}}});
//# sourceMappingURL=path---2015-2015-07-14-change-file-encoding-in-the-terminal-8e73db2cf6131f5789df.js.map