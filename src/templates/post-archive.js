import React from "react"
import { Link } from "gatsby"
import parse from "html-react-parser"

import { Layout } from "../components/layout"
import { Seo } from "../components/seo"

const BlogPostArchiveTemplate = ( { pageContext: { posts, count, term }} ) => {
  return (
    <Layout>
      <Seo title={term.name} />
      <h1>{term.name}</h1>
      <nav className="blog-post-nav">
        <ul >
          { posts.map( ({ uri, title}) => (
            <li>
                <Link to={uri} rel="prev">
                  {parse(title)}
                </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Layout>    
  )
  
}

export default BlogPostArchiveTemplate
