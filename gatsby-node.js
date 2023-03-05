const path = require(`path`)
const parse = require('html-react-parser');


exports.createPages = async ({ graphql, actions, reporter }) => {

  const { createPage } = actions
  
  const posts = await getPosts({ graphql, reporter })
  await createIndividualBlogPostPages({ posts, createPage })

  const pages = await getPages({ graphql, reporter })
  await createPages({ pages, createPage })

}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  await createCareerNode({ actions, createNodeId, createContentDigest })
}


const createCareerNode = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const CAREER_NODE_TYPE = 'Career'

  const { createNode } = actions

  const response = await fetch(process.env.CAREERS_API_URL)
  const careers = await response.json()

  careers.content.forEach(career => {
    console.log(`[Careers] Adding ${career.name}`)
    createNode({
      ...career,
      id: createNodeId(`${CAREER_NODE_TYPE}-${career.id}`),
      linkId: career.id,
      link: `${process.env.CAREERS_LINK}${career.id}`,
      parent: null,
      children: [],
      internal: {
        type: CAREER_NODE_TYPE,
        content: JSON.stringify(career),
        contentDigest: createContentDigest(career),
      },
    })
  })
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
