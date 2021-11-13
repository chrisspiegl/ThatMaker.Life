module.exports = {
  sizes: [
    {
      width: 320,
      rename: { suffix: "-320w" },
    },
    {
      width: 640,
      rename: { suffix: "-640w" },
    },
    {
      width: 1280,
      rename: { suffix: "-1280w" },
    },
    {
      width: 1920,
      rename: { suffix: "-1920w" },
    },
    {
      width: 3840,
      rename: { suffix: "-3840w" },
    },
  ],
  jpegOptions: {
    quality: 80,
    progressive: true,
    withMetadata: true,
    force: false,
  },
  webpOptions: {
    quality: 80,
    withMetadata: true,
    force: true,
  },
  pngOptions: {
    compressionLevel: 8,
    force: false,
  },
};
