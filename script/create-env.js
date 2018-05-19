const fs = require('fs');

fs.writeFileSync('env.js', 'TRELLO_API_KEY=' + process.env.TRELLO_API_KEY + '\n');
