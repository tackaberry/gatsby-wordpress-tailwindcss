import React from "react"
import { graphql } from "gatsby"
import parse from "html-react-parser"

import { Layout } from "../components/layout"
import { Seo } from "../components/seo"

const PageTemplate = ({ data: { post } }) => {

  return (
    <Layout>
      <Seo title={post.title} description={post.excerpt} />

      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{parse(post.title)}</h1>
        </header>

        {!!post.content && (
          <section itemProp="articleBody">{parse(post.content)}</section>
        )}


      </article>

    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query PageById(
    $id: String!
  ) {
    post: wpPage(id: { eq: $id }) {
      id
      content
      title
      featuredImage {
        node {
          altText
          localFile {
            childImageSharp {
              gatsbyImageData(
                quality: 100
                placeholder: TRACED_SVG
                layout: FULL_WIDTH
              )
            }
          }
        }
      }
    }
  }
`
