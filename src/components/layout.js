import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import parse from "html-react-parser"

import "../styles/@wordpress/block-library/build-style/style.css"
import "../styles/@wordpress/block-library/build-style/theme.css"
import "../styles/global.css"

const Layout = ({ isHomePage, children }) => {
  const {
    wp: {
      generalSettings: { title },
    },
  } = useStaticQuery(graphql`
    query LayoutQuery {
      wp {
        generalSettings {
          title
          description
        }
      }
    }
  `)

  return (
    <div className="container mx-auto" data-is-root-path={isHomePage}>
      <header className="container bg-slate-200 mb-10 p-4">
        {isHomePage ? (
          <h1 className="main-heading">
            <Link to="/">{parse(title)}</Link>
          </h1>
        ) : (
          <Link className="header-link-home" to="/">
            {title}
          </Link>
        )}
      </header>

      <main className="containe px-4">
        {children}
      </main>

      <footer className="container bg-slate-400 h-40 mt-10 mb-0 p-4">
      </footer>
    </div>
  )
}

export default Layout
