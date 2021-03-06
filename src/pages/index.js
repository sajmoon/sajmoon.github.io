import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges').filter(
      ({ node }) => isDevelopment || !node.frontmatter.draft
    )

    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          const isDraft = get(node, 'frontmatter.draft') || false
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                {isDraft && '[Draft] '}
                <Link style={{ boxShadow: 'none' }} to={node.fields.path}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <span style={{ margin: '10px' }}>&middot;</span>
              <small>{node.timeToRead} minute read.</small>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          timeToRead
          wordCount {
            words
          }
          fields {
            slug
            path
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            draft
          }
        }
      }
    }
  }
`
