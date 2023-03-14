
import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Careers = () => {
  const { careers } = useStaticQuery(graphql`
    query Career {
      careers: allCareer {
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
  `)

  return (
    <>
      {careers.nodes.map(career => (
        <div className="card"  key={career.linkId}>
          <a href={career.link}>
            <h2>{career.name}</h2>
          </a>
        </div>
      ))}
    </>
  )
}

export default Careers
