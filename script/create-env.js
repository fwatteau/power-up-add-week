const fs = require('fs');
console.log(process);
fs.writeFileSync('./.env', `TRELLO_API_KEY=${process.environment.TRELLO_API_KEY}\n`);
