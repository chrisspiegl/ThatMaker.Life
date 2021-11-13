const htmlmin = require('html-minifier')
const util = require("util");
const fs = require("fs");
const { DateTime } = require('luxon')

const fsStats = fs.statSync

module.exports = {
  dateToFormat: function (date, format) {
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat(String(format));
  },

  dateToISO: function (date) {
    return DateTime.fromJSDate(date, { zone: "utc" }).toISO({
      includeOffset: false,
      suppressMilliseconds: true,
    });
  },

  obfuscate: function (str) {
    const chars = [];
    for (var i = str.length - 1; i >= 0; i--) {
      chars.unshift(["&#", str[i].charCodeAt(), ";"].join(""));
    }
    return chars.join("");
  },

  replaceLineBreaks: function (str) {
    return JSON.stringify(
      htmlmin.minify(str, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
    );
  },

  filesize: (filepath) => {
    const stats = fsStats(filepath);
    return stats.size;
  },

};
