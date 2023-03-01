import * as React from "react"
import { Link } from "gatsby"

const Header = ({ siteTitle }) => (
  <header>
    <Link
      to="/"
    >
      {siteTitle}
    </Link>
  </header>
)

export default Header
