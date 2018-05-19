const fs = require('fs');

fs.writeFileSync('./.env', `TRELLO_API_KEY=${build.environment.TRELLO_API_KEY}\n`);
console.log(fs.readFileSync('./.env'));