webpackJsonp([0xd5e34c3065b7],{482:function(a,n){a.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/gatsby-add-drafts/index.md absPath of file >>> MarkdownRemark",html:'<p>Adding support for drafts in Gatsby.</p>\n<p>I started out with a blog starter for Gatsby. Pretty handy. Easy to get started. But it felt like magic. Why and how do we generate blog posts with urls from markdown files?</p>\n<p>So I started to actually read the guide. So before you start to look for a quick fix, read the guide <a href="https://www.gatsbyjs.org/docs/">here</a>. It acutally tells you how gatsby works. Hopefully you will be able to implment this yourself.</p>\n<h2>How can we add support for drafts?</h2>\n<p>To solve this problem for us we will just hide all blog posts that have been marked as drafts.</p>\n<p>Gatsby is built around the idea of plugins. We use the <a href="https://www.gatsbyjs.org/packages/gatsby-transformer-remark/">transformer-remark</a> plugin to convert markdown files to queriable data. The data is queried from a <a href="http://graphql.org/learn/">GraphQl instance</a>.</p>\n<p>Just remember that all this happens in build time, not run time.</p>\n<h3>Add meta data</h3>\n<p>We have a meta data block on top of each markdown file. We can add any data we need there. For example a draft: Bool. This block is called frontmatter for some reason.</p>\n<div class="gatsby-highlight">\n      <pre class="language-markdown"><code><span class="token hr punctuation">---</span>\ntitle: Title of page\ndate: "2018-01-01"\n<span class="token title important">draft: false\n<span class="token punctuation">---</span></span>\n</code></pre>\n      </div>\n<h3>Filter our posts</h3>\n<p>In our <code>pages/index.js</code> we list our posts and iterate over them to render links. We add a filter to hide our drafts.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> posts <span class="token operator">=</span> <span class="token keyword">get</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">\'props.data.allMarkdownRemark.edges\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>\n  <span class="token punctuation">(</span><span class="token punctuation">{</span> node <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token operator">!</span>node<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>draft\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>That doesn’t work yet. The markdown parse knows we added a <code>draft</code> value but we do not have it in the data node. We need to make sure we fetch it.</p>\n<h3>Query data</h3>\n<p>In the <code>pages/index.js</code> file we have a pageQuery object. It is a GraphQL query, so we tell it we need the draft status.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>frontmatter <span class="token punctuation">{</span>\n  <span class="token function">date</span><span class="token punctuation">(</span>formatString<span class="token punctuation">:</span> <span class="token string">"DD MMMM, YYYY"</span><span class="token punctuation">)</span>\n  title\n  draft\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>And we are done.</p>\n<h2>Show me a real implementaion!</h2>\n<p>Sure. I added draft support to this blog in <a href="https://github.com/sajmoon/sajmoon.github.io/commit/1340ce9e5fcda5b8b6a0ca1d791b488638df8b87">this commit</a>. Unfortunatly it includes some other stuff too. But there yout have all the changes needed.</p>\n<h2>Some improvements.</h2>\n<p>This is a pretty bad feature. It is hard to use this in development where you might actually have to read the post you are writing.</p>\n<p>So let’s hide the posts in production, but in development add a tag to them or something.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> isDevelopment <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>NODE_ENV <span class="token operator">===</span> <span class="token string">\'development\'</span>\n<span class="token keyword">const</span> posts <span class="token operator">=</span> <span class="token keyword">get</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">\'props.data.allMarkdownRemark.edges\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>\n  <span class="token punctuation">(</span><span class="token punctuation">{</span> node <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span> isDevelopment <span class="token operator">||</span> <span class="token operator">!</span>node<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>draft\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>Now we do not filter posts in development. We can then show in the UI something to tell the user it is a draft.</p>\n<p>In our render method:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> isDraft <span class="token operator">=</span> <span class="token keyword">get</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> <span class="token string">\'frontmatter.draft\'</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token boolean">false</span>\n\n<span class="token operator">&lt;</span>Link style<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> boxShadow<span class="token punctuation">:</span> <span class="token string">\'none\'</span> <span class="token punctuation">}</span><span class="token punctuation">}</span> to<span class="token operator">=</span><span class="token punctuation">{</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>slug<span class="token punctuation">}</span><span class="token operator">></span>\n  <span class="token punctuation">{</span> isDraft <span class="token operator">&amp;&amp;</span> <span class="token string">\'[Draft] \'</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">{</span>title<span class="token punctuation">}</span>\n<span class="token operator">&lt;</span><span class="token operator">/</span>Link<span class="token operator">></span>\n</code></pre>\n      </div>\n<h2>Summary</h2>\n<p>Now we can mark a page as draft. Have it visible during development, and hidden on the final site.</p>\n<p>We learned how Gatsby uses plugins to parse data, realized that we should look at the documentation, and also how gatsby uses GraphQL.</p>',frontmatter:{title:"Add support for drafts in gatsby",date:"January 14, 2018"}}},pathContext:{slug:"/gatsby-add-drafts/"}}}});
//# sourceMappingURL=path---gatsby-add-drafts-1e82a73a3ecd5c1463a5.js.map