const path = require("path");
const util = require("util");
const glob = require("glob");
const sharp = require("sharp");
const fs = require("fs");
const mkdirp = require("mkdirp");

const outputPath = `_site/contributor/`;

const resizeConf = require(path.join(__dirname, "../_data/resize.config.js"));

module.exports = class {
  async data() {
    const filePath = path.join(__dirname, `/`);
    return {
      layout: "blank",
      permalink: `/contributor/copy-files.json`,
      eleventyExcludeFromCollections: true,
      filePath,
    };
  }

  async loadFiles(fileFolder) {
    const cwd = path.resolve(fileFolder.file);
    const getFiles = util.promisify(glob);
    const copyFile = util.promisify(fs.copyFile);
    const processedFiles = [];

    const globString = "**/*(*.cover.jpg|*.mp3|*.chapters.json|*.transcripts.json)"

    const files = await getFiles(globString, { cwd: cwd });
    const filesCopied = await getFiles(globString, { cwd: outputPath });

    files.forEach(async function (file) {
      const ext = path.extname(file)
      const base = path.basename(file, ext)
      const dir = path.dirname(file)

      const fileName = `${base}${ext}`;

      mkdirp.sync(path.join(outputPath, dir))

      if (!filesCopied.includes(file)) {
        // console.log(`PASS THROUGH MASTER FOR ${file}`);
        await copyFile(`${cwd}/${file}`, `${outputPath}${dir}/${fileName}`)
        console.log(`Copied ${cwd}/${file} to ${outputPath}${dir}/${fileName}`)

        if (ext === '.jpg') {
          const image = sharp(fileFolder.file + file);
          image
            .jpeg(resizeConf.jpegOptions)
            .png(resizeConf.pngOptions)
            .webp(resizeConf.webpOptions);
          resizeConf.sizes.forEach(function (size) {
            const newPath = path.join(dir, base + size.rename.suffix + ext);
            const newPathOutput = path.join(outputPath, newPath);

            console.log(`RENDERING NEW RESIZED IMAGE FOR ${newPath}`);
            const resized = image.resize({
              width: size.width,
              withoutEnlargement: true,
              kernel: "lanczos2",
            });
            resized.toFile(newPathOutput);
          });
        }

      } else {
        // DO NOT PROCESS FILE SINCE IT ALREADY EXISTS
        // console.log(`FOUND MASTER FOR ${file}`);
      }

      processedFiles.push(file);
    });

    return JSON.stringify(processedFiles, null, "\t");
  }

 async render({ filePath }) {
    try {
      return await this.loadFiles({ file: filePath });
    } catch (err) {
      throw new Error(err);
    }
  }
};
