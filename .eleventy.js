const { DateTime } = require("luxon");
const readingTime = require('eleventy-plugin-reading-time')
const embedEverything = require("eleventy-plugin-embed-everything")

const now = new Date()

module.exports = (config) => {
  config.addPlugin(readingTime)
  config.addPlugin(embedEverything)

  // Custom collections
  const livePosts = post => {
    if (post.data.draft) return false
    if (post.inputPath.includes('draft')) return false
    if (post.date <= now) return true
    return false
  }

  config.addCollection('posts', collection => {
    return collection.getFilteredByGlob('./posts/*.md').filter(livePosts).reverse()
  })
  config.addCollection('drafts', collection => {
    return collection.getFilteredByGlob('./posts/*.md').filter(_ => !livePosts(_)).reverse();
  })

}