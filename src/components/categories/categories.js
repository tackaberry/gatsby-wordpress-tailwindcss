
import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Careers = () => {
  const { categories } = useStaticQuery(graphql`
    query Categories {
      categories: allWpTermNode {
        nodes {
          name
          slug
        }
      }
    }
  `)

  return (
    <>
      {categories.nodes.map(category => (
        <div className="card"  key={category.slug}>
          <Link to={`/category/${category.slug}`}>
            <h2>{category.name}</h2>
          </Link>
        </div>
      ))}
    </>
  )
}

export default Careers
