const moment = require('moment')
moment.locale('de')

module.exports = {
  dateReadable: (date) => moment(date).format("Do MMMM YYYY"),
  dateReadableShort: (date) => moment(date).format("Do MMM YYYY"),
  dateHtml: (date) => moment(date).toISOString(),
};
