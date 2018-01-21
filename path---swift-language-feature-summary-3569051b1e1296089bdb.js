webpackJsonp([0xb667f728144],{494:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/swift-language-feature-summary/index.md absPath of file >>> MarkdownRemark",html:'<h1>Summary of Swift language features</h1>\n<h3>Swith value bining</h3>\n<p>In a switch statement you can sort of pattern match on tuples.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>let anotherPoint = (2, 0)\nswitch anotherPoint {\ncase (let x, 0):\n    print("on the x-axis with an x value of \\(x)")\ncase (0, let y):\n    print("on the y-axis with a y value of \\(y)")\ncase let (x, y):\n    print("somewhere else at (\\(x), \\(y))")\n}\n// Prints "on the x-axis with an x value of 2"</code></pre>\n      </div>\n<p>The complete example can be read [here.]<a href="https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/ControlFlow.html#//apple_ref/doc/uid/TP40014097-CH9-ID120">https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift<em>Programming</em>Language/ControlFlow.html#//apple_ref/doc/uid/TP40014097-CH9-ID120</a>)</p>\n<h3>var title: String!</h3>\n<h3>Guard</h3>\n<p>Assignments are kept in scope</p>\n<h3>Named function arguments</h3>\n<p>Not strange in general but we are allowed to have two names for a paramter, an internal and an external.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>func methodName(external internal : String) {\n use internal\n}</code></pre>\n      </div>\n<p>called as <code>methodName(external: "value")</code></p>\n<h2>Xcode was slow</h2>\n<p>I had enabled slow animations. Check the debug menu.</p>\n<h2>Extra stuff</h2>\n<p>class func vs static func</p>',frontmatter:{title:"Summary of Swift language features",date:"January 07, 2017"}}},pathContext:{slug:"/swift-language-feature-summary/"}}}});
//# sourceMappingURL=path---swift-language-feature-summary-3569051b1e1296089bdb.js.map