'use strict';

const hogan = require('hogan.js'),
      moment = require('moment'),
      fs = require('fs'),
      path = require('path');

moment.locale('en-au');

const templates = [];
const templateDir = path.join(__dirname, 'templates');
fs.readdirSync(templateDir).forEach(function (file) {
  let template = hogan.compile(fs.readFileSync(path.join(templateDir, file), 'utf8'));
  let templateName = /(.+)\.mustache/.exec(file).pop();
  templates[templateName] = template;
});

const startDate = moment.utc().startOf('month').startOf('week');
const endDate = moment.utc().endOf('month').endOf('week');

let curDate = moment(startDate);
let curWeek;
const calendar = [ [ 'Monday    ', 'Tuesday   ', 'Wednesday ', 'Thursday  ', 'Friday    ', 'Saturday  ', 'Sunday    ' ] ];
const month = 11;

for (let i = 0; curDate.isBefore(endDate); i++) {
  if (i % 7 === 0) {
    curWeek = [];
    calendar.push(curWeek);
  }
  if (curDate.month() === month) {
    curWeek.push(curDate.format('YYYY-MM-DD'));
  } else {
    curWeek.push('          ');
  }
  curDate = curDate.add(1, 'days');
}

const output = templates['month'].render(
  {
    month: startDate.format('MMMM'),
    weeks: calendar
  },
  {
    week: templates['week']
  }
);

console.log(output);
