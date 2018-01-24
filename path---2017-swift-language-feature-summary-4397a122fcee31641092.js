webpackJsonp([0xcdcef77bc455],{534:function(n,a){n.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/swift-language-feature-summary/index.md absPath of file >>> MarkdownRemark",html:'<p>As I started to learn Swift i wrote a list of things that where notworthy about the language. This is the result: A short summary of interesting Swift language features.</p>\n<h2>Features</h2>\n<p>Listed in no particular order.</p>\n<h3>Swith value bining</h3>\n<p>In a switch statement you can sort of pattern match on tuples.</p>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code><span class="token keyword">let</span> anotherPoint <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>\n<span class="token keyword">switch</span> anotherPoint <span class="token punctuation">{</span>\n<span class="token keyword">case</span> <span class="token punctuation">(</span><span class="token keyword">let</span> x<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token function">print</span><span class="token punctuation">(</span><span class="token string">"on the x-axis with an x value of <span class="token interpolation"><span class="token delimiter variable">\\(</span>x<span class="token delimiter variable">)</span></span>"</span><span class="token punctuation">)</span>\n<span class="token keyword">case</span> <span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token keyword">let</span> y<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token function">print</span><span class="token punctuation">(</span><span class="token string">"on the y-axis with a y value of <span class="token interpolation"><span class="token delimiter variable">\\(</span>y<span class="token delimiter variable">)</span></span>"</span><span class="token punctuation">)</span>\n<span class="token keyword">case</span> <span class="token keyword">let</span> <span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token function">print</span><span class="token punctuation">(</span><span class="token string">"somewhere else at (<span class="token interpolation"><span class="token delimiter variable">\\(</span>x<span class="token delimiter variable">)</span></span>, <span class="token interpolation"><span class="token delimiter variable">\\(</span>y<span class="token delimiter variable">)</span></span>)"</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// Prints "on the x-axis with an x value of 2"</span>\n</code></pre>\n      </div>\n<p>The complete example can be read <a href="https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/ControlFlow.html#//apple_ref/doc/uid/TP40014097-CH9-ID120">in the Swift documentation.</a></p>\n<h3>var title: String!</h3>\n<h3>Guard</h3>\n<p>Assignments are kept in scope</p>\n<h3>Named function arguments</h3>\n<p>Not strange in general but we are allowed to have two names for a paramter, an internal and an external. Pretty cool hand handy.</p>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code><span class="token keyword">func</span> <span class="token function">methodName</span><span class="token punctuation">(</span>external <span class="token keyword">internal</span> <span class="token punctuation">:</span> <span class="token builtin">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">print</span><span class="token punctuation">(</span><span class="token keyword">internal</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>called as</p>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code><span class="token function">methodName</span><span class="token punctuation">(</span>external<span class="token punctuation">:</span> <span class="token string">"value"</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>Use unnamed parameters.</p>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code><span class="token keyword">func</span> <span class="token function">methodName</span><span class="token punctuation">(</span><span class="token number">_</span> <span class="token keyword">internal</span><span class="token punctuation">:</span> <span class="token builtin">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">print</span><span class="token punctuation">(</span><span class="token keyword">internal</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">methodName</span><span class="token punctuation">(</span><span class="token string">"string"</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3>Xcode was slow</h3>\n<p>The app in simulator was really slow. I thought it was a bug in XCode but it turned out that it was my fault. I had enabled slow animations. Check the debug menu where you can disable it.</p>\n<h3>class func vs static func</h3>\n<h3>Interpolation Optional strings</h3>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code><span class="token keyword">self</span><span class="token punctuation">.</span>nameLabel<span class="token punctuation">.</span>text <span class="token operator">=</span> feedItem<span class="token punctuation">.</span>user<span class="token punctuation">.</span>name <span class="token comment">// No need to unwrapp name.</span>\n\n<span class="token comment">// if we use user.name in a string interpolation, we need to unwrap it.</span>\n<span class="token keyword">if</span> <span class="token keyword">let</span> description <span class="token operator">=</span> feedItem<span class="token punctuation">.</span>description <span class="token punctuation">{</span>\n    <span class="token keyword">self</span><span class="token punctuation">.</span>descriptionLabel<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string">"<span class="token interpolation"><span class="token delimiter variable">\\(</span>feedItem<span class="token punctuation">.</span>user<span class="token punctuation">.</span>name<span class="token operator">!</span><span class="token delimiter variable">)</span></span> <span class="token interpolation"><span class="token delimiter variable">\\(</span>description<span class="token delimiter variable">)</span></span>"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h3>Computed properties</h3>\n<p>From the <a href="https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Properties.html">official docs</a></p>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code><span class="token keyword">var</span> center<span class="token punctuation">:</span> <span class="token builtin">Point</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">get</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">let</span> centerX <span class="token operator">=</span> origin<span class="token punctuation">.</span>x <span class="token operator">+</span> <span class="token punctuation">(</span>size<span class="token punctuation">.</span>width <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">let</span> centerY <span class="token operator">=</span> origin<span class="token punctuation">.</span>y <span class="token operator">+</span> <span class="token punctuation">(</span>size<span class="token punctuation">.</span>height <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">return</span> <span class="token function">Point</span><span class="token punctuation">(</span>x<span class="token punctuation">:</span> centerX<span class="token punctuation">,</span> y<span class="token punctuation">:</span> centerY<span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">set</span><span class="token punctuation">(</span>newCenter<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\torigin<span class="token punctuation">.</span>x <span class="token operator">=</span> newCenter<span class="token punctuation">.</span>x <span class="token operator">-</span> <span class="token punctuation">(</span>size<span class="token punctuation">.</span>width <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span>\n\t\torigin<span class="token punctuation">.</span>y <span class="token operator">=</span> newCenter<span class="token punctuation">.</span>y <span class="token operator">-</span> <span class="token punctuation">(</span>size<span class="token punctuation">.</span>height <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>or a read only short hand:</p>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code><span class="token keyword">var</span> volume<span class="token punctuation">:</span> <span class="token builtin">Double</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">return</span> width <span class="token operator">*</span> height <span class="token operator">*</span> depth\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h3>Protocols</h3>\n<h4>Default implementaions</h4>\n<div class="gatsby-highlight">\n      <pre class="language-swift"><code>extensioion <span class="token builtin">PrettyTextRepresentable</span>  <span class="token punctuation">{</span>\n\t<span class="token keyword">var</span> prettyTextualDescription<span class="token punctuation">:</span> <span class="token builtin">String</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">return</span> textualDescription\n\t<span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h2>iOS SDK</h2>\n<h3>NotificationCenter</h3>\n<p>In app observer, not notifications.</p>',frontmatter:{title:"Summary of Swift language features",date:"January 13, 2017"}}},pathContext:{slug:"/swift-language-feature-summary/"}}}});
//# sourceMappingURL=path---2017-swift-language-feature-summary-4397a122fcee31641092.js.map