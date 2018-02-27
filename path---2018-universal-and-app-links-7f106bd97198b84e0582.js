webpackJsonp([0xbf86b7d31668],{542:function(e,t){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/universal-and-app-links/index.md absPath of file >>> MarkdownRemark",html:'<p>Apple and Google provide a way to deep link into the application via a normal web url, call Universal links and Applink respectively. It is a good way to hand over interaction from a web app to a native app, or provide progressive enhancement where at certain pages on you web app the native app can take over.</p>\n<p>Though they have different names they solve the same problem. You specify a url and when you device navigates to it via a link, it checks if any application listens to it and, if so, opens the url in the native application instead. By default it will just open the application, and not show any specific content, all custom steps are up to you to implement.</p>\n<p>There are lots of good introductions to both <a href="https://developer.android.com/training/app-links/index.html">Applinks for android</a> and <a href="https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html">Universal links for iOS</a>, which will let you know exactly what you need to do to implement it.</p>\n<p>To test this locally can be a hassle. On iOS you need to provide proof of ownership of the domain, a biggest selling point for universal links over normal deep linking with a custom schema, by maintaining a <code>apple-app-site-association</code> on your domain. This guarantees that no other application on the device can hijack, for lack of a better word, your users but presents a problem; how do we test this locally when we develop a new feature?</p>\n<p>The solution is quite simple, although not pretty; you update the <code>apple-app-site-association</code> file for production with the entries you need for development. Now we have a backwards compatibility problem, people that have the production app installed will also hijack the new url we just added, but have no way of showing custom content to the user since that is not deployed yet. A nightmare!</p>\n<p>As a side note, this will also be a problem during feature rollout, and will basically force you to not use the url schema already used by your website, if you want all old and new clients to work.</p>\n<h2>Opening urls in emulators</h2>\n<p>We also have some problems reliably triggering the url in development. Typing the url in safari does not work. For this we can use a tool called <code>xcrun</code>, which will trigger the url in the app and open it in the default application that most certainly is a browser.</p>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>xcrun simctl openurl booted "https://www.example.com/blog"</code></pre>\n      </div>\n<p>If that specific url, or a pattern, would have been part of your site association file, it would open in you app.</p>\n<p>For Android we don’t have the problem of backwards compatability; the app specifies which urls that are intented to be open in the app, so you have can several versions of the app out in the wild, and only those clients that support a certain url pattern will open it.</p>\n<p>To open the url on a device or emulator we can use the <code>adb</code> command line tool as seen below.</p>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>adb shell am start -a android.intent.action.VIEW \\\n                             -c android.intent.category.BROWSABLE \\\n                             -d "https://example.com/blog"</code></pre>\n      </div>',frontmatter:{title:"Working with Universal and App links",date:"February 27, 2018"}}},pathContext:{slug:"/universal-and-app-links/"}}}});
//# sourceMappingURL=path---2018-universal-and-app-links-7f106bd97198b84e0582.js.map