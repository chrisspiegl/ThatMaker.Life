const path = require("path")
const util = require("util")
const glob = require("glob")
const sharp = require("sharp")
const fs = require('fs')
const mkdirp = require("mkdirp")

const outputPath = "_site/assets/images/"

const resizeConf = require(path.join(__dirname, "../_data/resize.config.js"));

module.exports = class {
  async data() {
    const filePath = path.join(__dirname, `/images/`)
    return {
      layout: 'blank',
      permalink: `/assets/images/images.json`,
      eleventyExcludeFromCollections: true,
      filePath,
    }
  }

  async loadImages(imgFolder) {
    const cwd = path.resolve(imgFolder.file)
    const getImages = util.promisify(glob)
    const processedImages = []

    const imgs = await getImages("**/*(*.jpg|*.png|*.gif)", { cwd: cwd })
    const imgsRendered = await getImages("**/*(*.jpg|*.png|*.gif)", { cwd: outputPath })

    imgs.forEach(function (img) {
      const ext = path.extname(img)
      const base = path.basename(img, ext)
      const dir = path.dirname(img)

      mkdirp.sync(path.join(outputPath, dir))

      if (!imgsRendered.includes(img)) {
        // console.log(`PASS THROUGH MASTER FOR ${img}`);
        let passThroughImg = sharp(imgFolder.file + img)
        passThroughImg.toFile(path.join(outputPath, dir, base + ext))
      } else {
        // console.log(`FOUND MASTER FOR ${img}`)
      }


      const image = sharp(imgFolder.file + img)
      image
      .jpeg(resizeConf.jpegOptions)
      .png(resizeConf.pngOptions)
      .webp(resizeConf.webpOptions)
      resizeConf.sizes.forEach(function (size) {
        const newPath = path.join(dir, base + size.rename.suffix + ext)
        const newPathOutput = path.join(outputPath, newPath)
        if (imgsRendered.includes(newPath)) {
          // console.log(`FOUND RESIZED IMAGE FOR ${newPath}`);
          return;
        }
        // console.log(`RENDERING NEW RESIZED IMAGE FOR ${newPath}`);
        const resized = image.resize({
          width: size.width,
          withoutEnlargement: true,
          kernel: "lanczos2",
        })
        resized.toFile(newPathOutput);
      })

      processedImages.push(img)
    })

    return JSON.stringify(processedImages, null, "\t")
  }

  async render({ filePath }) {
    try {
      return await this.loadImages({ file: filePath })
    } catch (err) {
      throw new Error(err)
    }
  }
}
