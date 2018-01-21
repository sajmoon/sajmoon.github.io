webpackJsonp([25418589883649],{512:function(e,n){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/1970-01-01-untitled.md absPath of file >>> MarkdownRemark",html:'<p>Setting up a small (minimal cluster) with several services running on.</p>\n<h2>Basics</h2>\n<ul>\n<li>Create cluster</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>gcloud container clusters clustername</code></pre>\n      </div>\n<blockquote>\n<p>Make sure you store all configurations in deployment.yaml files so you can easily modify your setup later. </p>\n</blockquote>\n<ul>\n<li>Create a persistent disc space.</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>gcloud compute disks create --size 10GB my-disk</code></pre>\n      </div>\n<p>Add volume configuration to your deployment.yaml file.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>      ports:\n         ...\n      volumeMounts:\n          # This name must match the volumes.name below.\n        - name: my-persistent-storage\n          mountPath: /var/lib/application\nvolumes:\n    - name: my-persistent-storage\n      gcePersistentDisk:\n        # This disk must already exist.\n        pdName: my-disk\n        fsType: ext4</code></pre>\n      </div>',frontmatter:{title:"(Untitled)",date:"January 01, 1970"}}},pathContext:{slug:"/1970-01-01-untitled/"}}}});
//# sourceMappingURL=path---1970-1970-01-01-untitled-544db93048a3cdaeb16c.js.map