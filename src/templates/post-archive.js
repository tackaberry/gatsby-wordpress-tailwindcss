import React from "react"
import { Link } from "gatsby"
import parse from "html-react-parser"

import Layout from "../components/layout"

const BlogPostArchiveTemplate = ( { pageContext: { posts, count, term }} ) => {
  console.log(posts);
  return (
    <Layout>
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
