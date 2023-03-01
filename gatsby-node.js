const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {

  const { createPage } = actions
  
  const posts = await getPosts({ graphql, reporter })
  await createIndividualBlogPostPages({ posts, createPage })

  const pages = await getPages({ graphql, reporter })
  await createPages({ pages, createPage })

}


const getPages = async ({ graphql, reporter }) => {
  const graphqlResult = await graphql(`
    query WpPages {
      allWpPage {
        edges {
          page: node {
            id
            uri
          }
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      graphqlResult.errors
    )
    return
  }

  return graphqlResult.data.allWpPage.edges
}

const getPosts = async ({ graphql, reporter }) => {
  const graphqlResult = await graphql( `
    query WpPosts {
      allWpPost(sort: { date: DESC }) {
        edges {
          previous {
            id
          }
          post: node {
            id
            uri
          }
          next {
            id
          }
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      graphqlResult.errors
    )
    return
  }

  return graphqlResult.data.allWpPost.edges
}

const createPages = async ({ pages, createPage }) =>
  Promise.all(
    pages.map(({ page }) =>
      createPage({
        path: page.uri,
        component: path.resolve(`./src/templates/page.js`),
        context: {
          id: page.id,
        },
      })
    )
  )


const createIndividualBlogPostPages = async ({ posts, createPage }) =>
  Promise.all(
    posts.map(({ previous, post, next }) =>
      createPage({
        path: post.uri,
        component: path.resolve(`./src/templates/post.js`),
        context: {
          id: post.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  )
