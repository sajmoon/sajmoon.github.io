webpackJsonp([61059119300957],{535:function(n,a){n.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/gatsby-add-drafts/index.md absPath of file >>> MarkdownRemark",html:'<p>Adding support for drafts in Gatsby.</p>\n<p>I started out with a blog starter for Gatsby. Pretty handy. Easy to get started. But it felt like magic. Why and how do we generate blog posts with urls from markdown files?</p>\n<p>So I started to actually read the guide. So before you start to look for a quick fix, read the guide <a href="https://www.gatsbyjs.org/docs/">here</a>. It acutally tells you how gatsby works. Hopefully you will be able to implment this yourself.</p>\n<h2>How can we add support for drafts?</h2>\n<p>To solve this problem for us we will just hide all blog posts that have been marked as drafts.</p>\n<p>Gatsby is built around the idea of plugins. We use the <a href="https://www.gatsbyjs.org/packages/gatsby-transformer-remark/">transformer-remark</a> plugin to convert markdown files to queriable data. The data is queried from a <a href="http://graphql.org/learn/">GraphQl instance</a>.</p>\n<p>Just remember that all this happens in build time, not run time.</p>\n<h3>Add meta data</h3>\n<p>We have a meta data block on top of each markdown file. We can add any data we need there. For example a draft: Bool. This block is called frontmatter for some reason.</p>\n<div class="gatsby-highlight">\n      <pre class="language-markdown"><code><span class="token hr punctuation">---</span>\ntitle: Title of page\ndate: "2018-01-01"\n<span class="token title important">draft: false\n<span class="token punctuation">---</span></span>\n</code></pre>\n      </div>\n<h3>Filter our posts</h3>\n<p>In our <code>pages/index.js</code> we list our posts and iterate over them to render links. We add a filter to hide our drafts.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> posts <span class="token operator">=</span> <span class="token keyword">get</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">\'props.data.allMarkdownRemark.edges\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>\n  <span class="token punctuation">(</span><span class="token punctuation">{</span> node <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token operator">!</span>node<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>draft\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>That doesn’t work yet. The markdown parse knows we added a <code>draft</code> value but we do not have it in the data node. We need to make sure we fetch it.</p>\n<h3>Query data</h3>\n<p>In the <code>pages/index.js</code> file we have a pageQuery object. It is a GraphQL query, so we tell it we need the draft status.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>frontmatter <span class="token punctuation">{</span>\n  <span class="token function">date</span><span class="token punctuation">(</span>formatString<span class="token punctuation">:</span> <span class="token string">"DD MMMM, YYYY"</span><span class="token punctuation">)</span>\n  title\n  draft\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>And we are done.</p>\n<h2>Show me a real implementation!</h2>\n<p>Sure. I added draft support to this blog in <a href="https://github.com/sajmoon/sajmoon.github.io/commit/1340ce9e5fcda5b8b6a0ca1d791b488638df8b87">this commit</a>. Unfortunately it includes some other stuff too. But there you have all the changes needed.</p>\n<h2>Some improvements.</h2>\n<p>This is a pretty bad feature. It is hard to use this in development where you might actually have to read the post you are writing.</p>\n<p>So let’s hide the posts in production, but in development add a tag to them or something.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> isDevelopment <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>NODE_ENV <span class="token operator">===</span> <span class="token string">\'development\'</span>\n<span class="token keyword">const</span> posts <span class="token operator">=</span> <span class="token keyword">get</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">\'props.data.allMarkdownRemark.edges\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>\n  <span class="token punctuation">(</span><span class="token punctuation">{</span> node <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span> isDevelopment <span class="token operator">||</span> <span class="token operator">!</span>node<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>draft\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>Now we do not filter posts in development. We can then show in the UI something to tell the user it is a draft.</p>\n<p>In our render method:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> isDraft <span class="token operator">=</span> <span class="token keyword">get</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> <span class="token string">\'frontmatter.draft\'</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token boolean">false</span>\n\n<span class="token operator">&lt;</span>Link style<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> boxShadow<span class="token punctuation">:</span> <span class="token string">\'none\'</span> <span class="token punctuation">}</span><span class="token punctuation">}</span> to<span class="token operator">=</span><span class="token punctuation">{</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>slug<span class="token punctuation">}</span><span class="token operator">></span>\n  <span class="token punctuation">{</span> isDraft <span class="token operator">&amp;&amp;</span> <span class="token string">\'[Draft] \'</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">{</span>title<span class="token punctuation">}</span>\n<span class="token operator">&lt;</span><span class="token operator">/</span>Link<span class="token operator">></span>\n</code></pre>\n      </div>\n<h2>Change the format of the url</h2>\n<p>I wanted to add year to the url for the posts, both so they could persist over\nyears where I imagine I have many posts soon, and also to understand more about\nGatsby.</p>\n<p>The starting position is that we generate posts from markdown, which have a\ntitle and a date in the <code>frontmatter</code>. The path is generated from the title, and\nbecomes a slug.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>_<span class="token punctuation">.</span><span class="token function">each</span><span class="token punctuation">(</span>result<span class="token punctuation">.</span>data<span class="token punctuation">.</span>allMarkdownRemark<span class="token punctuation">.</span>edges<span class="token punctuation">,</span> edge <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token function">createPage</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    path<span class="token punctuation">:</span> edge<span class="token punctuation">.</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>slug<span class="token punctuation">,</span>\n    component<span class="token punctuation">:</span> blogPost<span class="token punctuation">,</span>\n    context<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      slug<span class="token punctuation">:</span> edge<span class="token punctuation">.</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>slug<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>We link to these pages via the slug:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token operator">&lt;</span>Link to<span class="token operator">=</span><span class="token punctuation">{</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>path<span class="token punctuation">}</span><span class="token operator">></span>\n</code></pre>\n      </div>\n<p>To create pages on a different path we just change the about createPage call to\nspecify a year too.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>  path<span class="token punctuation">:</span> edge<span class="token punctuation">.</span>node<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>date <span class="token operator">+</span> edge<span class="token punctuation">.</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>slug<span class="token punctuation">,</span>\n</code></pre>\n      </div>\n<p>However, everywhere we link to that post we need to include the date, formatted\nand ready.</p>\n<h3>Where does slug come from?</h3>\n<p>So here is the question that actually helped me understand Gatsby a bit\nbetter. We don’t have slug in frontmatter, nor do we calculate it every time we\nuse it. It is sorted in GraphQL and we get it with a query. It is not in\nfrontmatter but on fields.</p>\n<p>So when and where do we generate that, and how is it done?</p>\n<p>Enter Gatsby lifecycle.</p>\n<p>The documentation is pretty good at listing what you can do with lifecycles, you\ncan read it <a href="https://www.gatsbyjs.org/docs/node-apis/">here</a>, but I found it a\nbit confusing. Maybe because I used a starter boilerplate for Gatsby instead of\nstarting from scratch.</p>\n<p>We read our posts with <a href="https://www.gatsbyjs.org/packages/gatsby-source-filesystem/"><code>gatsby-source-filesystem</code></a>, all markdown files are parsed\nwith <a href="https://www.gatsbyjs.org/packages/gatsby-transformer-remark/"><code>gatsby-transformer-remark</code></a> which is the files we eventually see live.</p>\n<p>The first plugin is a source plugin. It generates File nodes. Remark reads nodes, and\nparses what it needs, in this case markdown. It creates ‘MarkdownRemark’ Nodes.</p>\n<p>A fun thing, that is not really well documented about <code>gatsby-transformer-remark</code> is that it can provide some useful meta data. Remark, which is used in the background, can tell us word count for example.</p>\n<p>And from word count it is not that far to an estimation of reading time.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>    <span class="token function">allMarkdownRemark</span><span class="token punctuation">(</span>sort<span class="token punctuation">:</span> <span class="token punctuation">{</span> fields<span class="token punctuation">:</span> <span class="token punctuation">[</span>frontmatter___date<span class="token punctuation">]</span><span class="token punctuation">,</span> order<span class="token punctuation">:</span> DESC <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      edges <span class="token punctuation">{</span>\n        node <span class="token punctuation">{</span>\n          excerpt\n          timeToRead\n          wordCount <span class="token punctuation">{</span>\n            words\n          <span class="token punctuation">}</span>\n          <span class="token operator">...</span>etc\n</code></pre>\n      </div>\n<p>That information we can display in our UI.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token operator">&lt;</span>span<span class="token operator">></span><span class="token punctuation">{</span>node<span class="token punctuation">.</span>timeToRead<span class="token punctuation">}</span> minute read<span class="token punctuation">.</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">></span>\n</code></pre>\n      </div>\n<p>It provides more useful data points (headings, tableOfContent, etc). Read the source code <a href="https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-remark/src/extend-node-type.js#L315">here</a>.</p>\n<h3>Gatsby onCreateNode</h3>\n<p><code>onCreateNode</code> is called when a node is created, and in this hook I already had\ncode to generate the slug.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>  <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token function">createFilePath</span><span class="token punctuation">(</span><span class="token punctuation">{</span> node<span class="token punctuation">,</span> getNode <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token function">createNodeField</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    name<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`slug`</span></span><span class="token punctuation">,</span>\n    node<span class="token punctuation">,</span>\n    value<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>We mutate the node, and add the property <code>slug</code> which we need. We can customize\nthis to add a <code>path</code> field variable that includes year and the slug.</p>\n<p>To create links to these pages we simply do <code>&#x3C;Link to={ node.fields.path }></code>.</p>\n<p>So, we add <code>path</code> to the MarkdownNode:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>  <span class="token keyword">const</span> date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>date<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> year <span class="token operator">=</span> date<span class="token punctuation">.</span><span class="token function">getFullYear</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> path <span class="token operator">=</span> year <span class="token operator">+</span> value\n\n  <span class="token function">createNodeField</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    node<span class="token punctuation">,</span>\n    name<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`path`</span></span><span class="token punctuation">,</span>\n    value<span class="token punctuation">:</span> path<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>And we create pages with that path instead of the slug:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>_<span class="token punctuation">.</span><span class="token function">each</span><span class="token punctuation">(</span>result<span class="token punctuation">.</span>data<span class="token punctuation">.</span>allMarkdownRemark<span class="token punctuation">.</span>edges<span class="token punctuation">,</span> edge <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> path <span class="token operator">=</span> edge<span class="token punctuation">.</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>path\n  <span class="token function">createPage</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    path<span class="token punctuation">:</span> path<span class="token punctuation">,</span>\n    component<span class="token punctuation">:</span> blogPost<span class="token punctuation">,</span>\n    context<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      slug<span class="token punctuation">:</span> edge<span class="token punctuation">.</span>node<span class="token punctuation">.</span>fields<span class="token punctuation">.</span>slug<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h2>Summary</h2>\n<p>Now we can mark a page as draft. Have it visible during development, and hidden on the final site.</p>\n<p>We learned how Gatsby uses plugins to parse data, realized that we should look at the documentation, and also how gatsby uses GraphQL.</p>\n<p>We now know about Nodes in Gatsby.</p>\n<p>We looked at one hook Gatsby provides into the internal workings, and used it to\nattach more date to nodes.</p>',frontmatter:{title:"Add support for drafts in gatsby",date:"January 14, 2018"}}},pathContext:{slug:"/gatsby-add-drafts/"}}}});
//# sourceMappingURL=path---2018-gatsby-add-drafts-d9a816ba077dd33762eb.js.map