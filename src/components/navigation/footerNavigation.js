import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import parse from 'html-react-parser';

const Nav = () => {

    const data = useStaticQuery(graphql`
        query {
            wpNavigation( title: {eq: "Footer Navigation"} ) {
              id
              content
              slug
            }
        }`)

  return (
    <ul>
        {parse(data.wpNavigation.content)}
    </ul>
  )
}

export default Nav
