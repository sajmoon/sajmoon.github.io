---
title: Add support for drafts in gatsby
date: "2018-01-14"
draft: false
---

Adding support for drafts in Gatsby.

I started out with a blog starter for Gatsby. Pretty handy. Easy to get started. But it felt like magic. Why and how do we generate blog posts with urls from markdown files?

So I started to actually read the guide. So before you start to look for a quick fix, read the guide [here](https://www.gatsbyjs.org/docs/). It acutally tells you how gatsby works. Hopefully you will be able to implment this yourself.

## How can we add support for drafts?

To solve this problem for us we will just hide all blog posts that have been marked as drafts.

Gatsby is built around the idea of plugins. We use the [transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/) plugin to convert markdown files to queriable data. The data is queried from a [GraphQl instance](http://graphql.org/learn/).

Just remember that all this happens in build time, not run time.

### Add meta data

We have a meta data block on top of each markdown file. We can add any data we need there. For example a draft: Bool. This block is called frontmatter for some reason.

```markdown
---
title: Title of page
date: "2018-01-01"
draft: false
---
```

### Filter our posts

In our `pages/index.js` we list our posts and iterate over them to render links. We add a filter to hide our drafts.

```javascript
const posts = get(this, 'props.data.allMarkdownRemark.edges').filter(
  ({ node }) => !node.frontmatter.draft
)
```

That doesn't work yet. The markdown parse knows we added a `draft` value but we do not have it in the data node. We need to make sure we fetch it.

### Query data

In the `pages/index.js` file we have a pageQuery object. It is a GraphQL query, so we tell it we need the draft status.

```javascript
frontmatter {
  date(formatString: "DD MMMM, YYYY")
  title
  draft
}
```

And we are done.

## Show me a real implementation!

Sure. I added draft support to this blog in [this commit](https://github.com/sajmoon/sajmoon.github.io/commit/1340ce9e5fcda5b8b6a0ca1d791b488638df8b87). Unfortunately it includes some other stuff too. But there you have all the changes needed.

## Some improvements.

This is a pretty bad feature. It is hard to use this in development where you might actually have to read the post you are writing.

So let's hide the posts in production, but in development add a tag to them or something.

```javascript
const isDevelopment = process.env.NODE_ENV === 'development'
const posts = get(this, 'props.data.allMarkdownRemark.edges').filter(
  ({ node }) => isDevelopment || !node.frontmatter.draft
)
```

Now we do not filter posts in development. We can then show in the UI something to tell the user it is a draft.

In our render method:

```javascript
const isDraft = get(node, 'frontmatter.draft') || false

<Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
  { isDraft && '[Draft] ' }
  {title}
</Link>
```

## Change the format of the url

I wanted to add year to the url for the posts, both so they could persist over
years where I imagine I have many posts soon, and also to understand more about
Gatsby.

The starting position is that we generate posts from markdown, which have a
title and a date in the `frontmatter`. The path is generated from the title, and
becomes a slug.

```javascript
_.each(result.data.allMarkdownRemark.edges, edge => {
  createPage({
    path: edge.node.fields.slug,
    component: blogPost,
    context: {
      slug: edge.node.fields.slug,
    },
  })
}
````

We link to these pages via the slug:

```javascript
<Link to={node.fields.path}>
```

To create pages on a different path we just change the about createPage call to
specify a year too.

```javascript
  path: edge.node.frontmatter.date + edge.node.fields.slug,
````

However, everywhere we link to that post we need to include the date, formatted
and ready.

### Where does slug come from?

So here is the question that actually helped me understand Gatsby a bit
better. We don't have slug in frontmatter, nor do we calculate it every time we
use it. It is sorted in GraphQL and we get it with a query. It is not in
frontmatter but on fields.

So when and where do we generate that, and how is it done?

Enter Gatsby lifecycle.

The documentation is pretty good at listing what you can do with lifecycles, you
can read it [here](https://www.gatsbyjs.org/docs/node-apis/), but I found it a
bit confusing. Maybe because I used a starter boilerplate for Gatsby instead of
starting from scratch.

We read our posts with [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/), all markdown files are parsed
with [`gatsby-transformer-remark`](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/) which is the files we eventually see live.

The first plugin is a source plugin. It generates File nodes. Remark reads nodes, and
parses what it needs, in this case markdown. It creates 'MarkdownRemark' Nodes.

### Gatsby onCreateNode

`onCreateNode` is called when a node is created, and in this hook I already had
code to generate the slug.

```javascript
  const value = createFilePath({ node, getNode })
  createNodeField({
    name: `slug`,
    node,
    value,
  })
```

We mutate the node, and add the property `slug` which we need. We can customize
this to add a `path` field variable that includes year and the slug.

To create links to these pages we simply do `<Link to={ node.fields.path }>`.

So, we add `path` to the MarkdownNode:

```javascript
  const date = new Date(node.frontmatter.date)
  const year = date.getFullYear()
  const path = year + value

  createNodeField({
    node,
    name: `path`,
    value: path,
  })
```

And we create pages with that path instead of the slug:

```javascript
_.each(result.data.allMarkdownRemark.edges, edge => {
  const path = edge.node.fields.path
  createPage({
    path: path,
    component: blogPost,
    context: {
      slug: edge.node.fields.slug,
    },
  })
}
```

## Summary

Now we can mark a page as draft. Have it visible during development, and hidden on the final site.

We learned how Gatsby uses plugins to parse data, realized that we should look at the documentation, and also how gatsby uses GraphQL.

We now know about Nodes in Gatsby.

We looked at one hook Gatsby provides into the internal workings, and used it to
attach more date to nodes.
