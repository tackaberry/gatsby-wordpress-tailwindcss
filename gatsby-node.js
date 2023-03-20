const path = require(`path`)
const parse = require('html-react-parser');


exports.createPages = async ({ graphql, actions, reporter }) => {

  const { createPage } = actions
  
  const posts = await getPosts({ graphql, reporter })
  await createIndividualBlogPostPages({ posts, createPage })

  const postsByTermSlug = {}
  posts.forEach( ({post}) =>{
    post.terms.nodes.forEach(term=>{
      postsByTermSlug[term.slug] = postsByTermSlug[term.slug] || []
      postsByTermSlug[term.slug].push(post)  
    })
  })

  const terms = await getTerms({ graphql, reporter })

  terms.forEach( ({term}) =>{
    const posts = postsByTermSlug[term.slug]
    if(posts){
      const count = posts.length
      createPage({
        path: `category/${term.slug}`,
        component: path.resolve(`./src/templates/post-archive.js`),
        context: {
          id: term.id,
          term, posts, count
        },
      })
    }
  })

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
            title
            terms {
              nodes {
                name
                slug
              }
            }
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


const getTerms = async ({ graphql, reporter }) => {
  const graphqlResult = await graphql( `
    query WpTerms {
      allWpTermNode {
        edges {
          term: node {
            id
            name
            slug
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

  return graphqlResult.data.allWpTermNode.edges
}

const createPages = async ({ pages, createPage }) =>
  Promise.all(
    pages.map(({ page }) =>
      createPage({
        path: page.uri || page.id,
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
        path: post.uri || post.id,
        component: path.resolve(`./src/templates/post.js`),
        context: {
          id: post.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  )
