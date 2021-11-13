const path = require("path")

module.exports = {
  siteTitle: "ThatMaker.Life",
  siteName: "ThatMaker.Life",
  url: "https://ThatMaker.Life",
  imageResizer: (width, height, origin) => {
    const ext = path.extname(origin)
    const base = path.basename(origin, ext)
    const dir = path.dirname(origin)
    const imagePath = path.join(dir, `${base}-${width}w${ext}`)
    return imagePath
  },
  authorEmail: "chris@ThatMaker.Life",
  build: {
    env: process.env.ELEVENTY_ENV || process.env.NODE_ENV || 'development',
    timestamp: new Date(),
  },
  podlov: {
    version: 5,
  },
  podcast: {
    title: "ThatMaker.Life",
    subtitle: "Von, Mit, und Für Macher.",
    summary: "Eine Podcast welches zum machen anregt. Meistens moderiert von Chris Spiegl mit interessanten Gästen von Hof und aus ganz Deutschland.",
    cover: "/assets/forschergeist_500x500.jpg", // TODO: Replace cover photo.
    feed: "https://ThatMaker.Life/podcast/feed",
    applepodcast: "https://ThatMaker.Life/podcast/applepodcast",
    link: "https://ThatMaker.Life",
  },
}
