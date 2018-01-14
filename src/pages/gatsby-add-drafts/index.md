---
title: Add support for drafts in gatsby
date: "2018-01-14"
draft: true
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

## Show me a real implementaion!

Sure. I added draft support to this blog in [this commit](https://github.com/sajmoon/sajmoon.github.io/commit/1340ce9e5fcda5b8b6a0ca1d791b488638df8b87). Unfortunatly it includes some other stuff too. But there yout have all the changes needed.

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

## Summary

Now we can mark a page as draft. Have it visible during development, and hidden on the final site.

We learned how Gatsby uses plugins to parse data, realized that we should look at the documentation, and also how gatsby uses GraphQL.
