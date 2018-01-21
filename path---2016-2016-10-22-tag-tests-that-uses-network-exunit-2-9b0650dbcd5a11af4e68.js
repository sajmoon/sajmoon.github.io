webpackJsonp([25440093797002],{532:function(e,t){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/2016-10-22-tag-tests-that-uses-network-exunit-2.md absPath of file >>> MarkdownRemark",html:'<p>Tag tests as tests that require network, and only run them when needed.</p>\n<p>We do this to speed up that test suite. Ideally you should not rely on network in your tests but sometimes it is necessary.</p>\n<h3>How?</h3>\n<p>Add a tag to the test.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>@tag :network\ntest "expensive test" do\nend</code></pre>\n      </div>\n<p>configure ExUnit to exclude these tests in <code>test/test_helper.ex</code></p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>ExUnit.configure exclude: [network: true]\nExUnit.start</code></pre>\n      </div>\n<p>run the test and you will have one test skipped.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>$ mix test\nExcluding tags: [network: true]\n\n.......................................................\n\nFinished in 0.3 seconds\n56 tests, 0 failures, 1 skipped</code></pre>\n      </div>\n<p>When you want to run your network tests use the —include argument to mix test</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>mix test --include network\nIncluding tags: [:network]\nExcluding tags: [network: true]\n\n........................................................\n\nFinished in 1.4 seconds\n56 tests, 0 failures</code></pre>\n      </div>\n<h3>Run all by default</h3>\n<p>if you want to run all your tests by default and only exclude network tests when you explicitly request it you dont have to configure ExUnit inte test_helper.ex</p>\n<p>instead use the —exclude argument</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>mix test --exclude network</code></pre>\n      </div>',frontmatter:{title:"Tag tests that uses network - ExUnit",date:"October 22, 2016"}}},pathContext:{slug:"/2016-10-22-tag-tests-that-uses-network-exunit-2/"}}}});
//# sourceMappingURL=path---2016-2016-10-22-tag-tests-that-uses-network-exunit-2-9b0650dbcd5a11af4e68.js.map