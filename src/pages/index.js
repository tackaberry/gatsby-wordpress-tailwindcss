import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"

const IndexPage = ({data}) => (
  <Layout>
      <h1>
        Home
      </h1>
      <h4>Pages</h4>
      {data.allWpPage.nodes.map(node => (
        <div className="card" key={node.slug}>
          <Link to={node.slug}>
            <h2>{node.title}</h2>
          </Link>
        </div>
      ))}
      <h4>Posts</h4>
      {data.allWpPost.nodes.map(node => (
        <div className="card"  key={node.slug}>
          <Link to={node.slug}>
            <h2>{node.title}</h2>
          </Link>
        </div>
      ))}
      <h4>Careers</h4>
      {data.allCareer.nodes.map(career => (
        <div className="card"  key={career.id}>
          <Link to={career.link}>
            <h2>{career.name}</h2>
          </Link>
        </div>
      ))}
  </Layout>
)

export default IndexPage

export const pageQuery = graphql`
  query {
    allWpPost(sort: {date: ASC}) {
      nodes {
        title
        excerpt
        slug
      }
    }
    allWpPage {
      nodes {
        title
        slug
      }
    }
    allCareer {
      nodes {
        linkId
        link
        location {
          city
          country
          remote
        }
        department {
          label
        }
        name
      }
    }
  }
`