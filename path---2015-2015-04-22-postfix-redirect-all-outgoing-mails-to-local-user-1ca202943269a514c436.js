webpackJsonp([82688832499862],{516:function(e,t){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/2015-04-22-postfix-redirect-all-outgoing-mails-to-local-user.md absPath of file >>> MarkdownRemark",html:'<p>While developing an application I often have to test, and use the email feature. Either I register and use my normal email, or a dump mailbox to collect the spam from development. But you can also redirect all outgoing email from postfix to a local users mailbox.</p>\n<h2>Start postfix</h2>\n<p>OS X ships with postfixed installed, you just have to start it.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>sudo launchctl start org.postfix.master </code></pre>\n      </div>\n<p>The command to stop it is very similar</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>sudo launchctl stop org.postfix.master </code></pre>\n      </div>\n<h2>Redirect</h2>\n<p>Open <code>/etc/postfix/main.cf</code> and add the following to the end of the file.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>canonical_maps = regexp:/etc/postfix/canonical-redirect</code></pre>\n      </div>\n<p>If it does not exists create <code>/etc/postfix/canonical-redirect</code> and add some regexp to it.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>/^.*$/ username</code></pre>\n      </div>\n<p>This will redirect all outgoing mails to the inbox of the user specified.</p>\n<p>Restart postfix using the stop and start command</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>sudo launchctl start org.postfix.master \nsudo launchctl stop org.postfix.master </code></pre>\n      </div>\n<h2>Check inbox</h2>\n<p>With the <code>mail</code> command we see all mails.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>$ mail\nMail version 8.1 6/6/93.  Type ? for help.\n"/var/mail/simon": 1 message 1 new\n>N  1 simon@Simons-MacBook  Wed Apr 22 12:33  27/1083  "http://localhost:8080: Reset Your Password"\n?</code></pre>\n      </div>\n<p>Type ‘1’ and hit enter to open that email.</p>',frontmatter:{title:"Postfix - Redirect all outgoing mails to local user",date:"April 22, 2015"}}},pathContext:{slug:"/2015-04-22-postfix-redirect-all-outgoing-mails-to-local-user/"}}}});
//# sourceMappingURL=path---2015-2015-04-22-postfix-redirect-all-outgoing-mails-to-local-user-1ca202943269a514c436.js.map