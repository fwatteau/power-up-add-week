const fs = require('fs');

fs.writeFileSync('./.env', `TRELLO_API_KEY=${process.env.TRELLO_API_KEY}\n`);
console.log(process.cwd());