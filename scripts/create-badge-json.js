const fs = require('fs');
const coveageString = fs.readFileSync('coverage/coverage-summary.json', 'utf8');
const coverage = JSON.parse(coveageString);
const total = coverage.total.lines.pct;
const output = {
  'message':`${total}%`,'label':'Integration Tests','schemaVersion':1,
};

fs.writeFileSync('coverage/shields.json', JSON.stringify(output, null, 2));