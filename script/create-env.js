const fs = require('fs');
console.log(process.env);
fs.writeFileSync('./.env', `TRELLO_API_KEY=${process.env.TRELLO_API_KEY}\n`);

console.log(fs.readFileSync('./.env'));