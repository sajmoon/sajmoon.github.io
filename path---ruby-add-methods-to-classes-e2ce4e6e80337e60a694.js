webpackJsonp([0x7f1bf42b462d],{486:function(n,s){n.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/ruby-add-methods-to-classes/index.md absPath of file >>> MarkdownRemark",html:'<p>We can always extend classes in Ruby. Both predefined and classes we create ourselfs. We say that classes are <em>always open</em>.</p>\n<p>If you extend a built-in class be sure that it should be there. A string for example probably should not have methods to generate urls to a placeholder image, even if it could. It does not belong in the String class.</p>\n<h2>Add an instance method to a built-in class.</h2>\n<p>Add a method to Integers that returns a random value between 0 and the integer value.</p>\n<div class="gatsby-highlight">\n      <pre class="language-ruby"><code><span class="token keyword">begin</span>\n  <span class="token number">19</span><span class="token punctuation">.</span>random <span class="token comment"># Undefined method \'random\' for 19:Integer</span>\n<span class="token keyword">rescue</span> <span class="token constant">NoMethodError</span>\n  puts <span class="token string">"19.random is not defined"</span>\n<span class="token keyword">end</span>\n\nputs <span class="token string">"extending Integer"</span>\n<span class="token keyword">class</span> <span class="token class-name">Integer</span>\n  <span class="token keyword">def</span> random\n    <span class="token constant">Random</span><span class="token punctuation">.</span><span class="token function">rand</span><span class="token punctuation">(</span><span class="token keyword">self</span><span class="token punctuation">)</span>\n  <span class="token keyword">end</span>\n<span class="token keyword">end</span>\n\nputs <span class="token string">"19.random => <span class="token interpolation"><span class="token delimiter tag">#{</span><span class="token number">19</span><span class="token punctuation">.</span>random<span class="token delimiter tag">}</span></span>"</span>\n</code></pre>\n      </div>\n<p><code>self</code> refers to the instance of the object itself. In the case of our Integer self is 19.</p>\n<h2>Add a class method</h2>\n<p>To add a class method is also simple.</p>\n<div class="gatsby-highlight">\n      <pre class="language-ruby"><code><span class="token keyword">begin</span>\n  <span class="token builtin">Integer</span><span class="token punctuation">.</span>random <span class="token number">3</span>\n<span class="token keyword">rescue</span> <span class="token constant">NoMethodError</span>\n  puts <span class="token string">"Integer.random is not defined"</span>\n<span class="token keyword">end</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Integer</span>\n  <span class="token keyword">def</span> <span class="token keyword">self</span><span class="token punctuation">.</span>random number\n    <span class="token constant">Random</span><span class="token punctuation">.</span>rand number\n  <span class="token keyword">end</span>\n<span class="token keyword">end</span>\n\nputs <span class="token string">"Integer.random 3 => <span class="token interpolation"><span class="token delimiter tag">#{</span>Integer<span class="token punctuation">.</span>random <span class="token number">3</span><span class="token delimiter tag">}</span></span>"</span>\n</code></pre>\n      </div>\n<p>We add methods to self.</p>\n<h2>Extend active record</h2>\n<p>We use Kaminari to paginate our application. We need to render the meta data in the json response, and to do that we extend ActiveRecord to provide this functionalliy.</p>\n<p>Extend ActiveRecord::Relation with a <code>pagination_info</code> method.</p>\n<p>In <code>lib/active_record_relation_extension.rb</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-ruby"><code><span class="token keyword">module</span> <span class="token constant">ActiveRecordRelationExtension</span>\n  <span class="token keyword">def</span> pagination_info\n    <span class="token keyword">if</span> respond_to<span class="token operator">?</span> <span class="token symbol">:total_count</span>\n      <span class="token punctuation">{</span>\n        total_count<span class="token punctuation">:</span> total_count<span class="token punctuation">,</span>\n        current_page<span class="token punctuation">:</span> current_page<span class="token punctuation">,</span>\n        next_page<span class="token punctuation">:</span> next_page<span class="token punctuation">,</span>\n        prev_page<span class="token punctuation">:</span> prev_page<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span>\n    <span class="token keyword">else</span>\n      <span class="token keyword">nil</span>\n    <span class="token keyword">end</span>\n  <span class="token keyword">end</span>\n <span class="token keyword">end</span>\n</code></pre>\n      </div>\n<p> Then we also need to configure it. We push it to the inheritance stack of Relation.</p>\n<p><code>config/initializers/active_record_relation_pagination.rb</code></p>\n<div class="gatsby-highlight">\n      <pre class="language-ruby"><code><span class="token constant">ActiveRecord</span><span class="token punctuation">:</span><span class="token symbol">:Relation</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token symbol">:include</span><span class="token punctuation">,</span> <span class="token constant">ActiveRecordRelationExtension</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>',frontmatter:{title:"Add methods to a Ruby class",date:"January 16, 2018"}}},pathContext:{slug:"/ruby-add-methods-to-classes/"}}}});
//# sourceMappingURL=path---ruby-add-methods-to-classes-e2ce4e6e80337e60a694.js.map