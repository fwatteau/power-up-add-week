const fs = require('fs');

fs.writeFileSync('js/env.js', 'const TRELLO_API_KEY= "' + process.env.TRELLO_API_KEY + '";\n');
