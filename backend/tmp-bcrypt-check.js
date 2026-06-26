const bcrypt = require('bcrypt');
const hashes = [
  '$2b$10$4FZrEhYl9Yw1WPTrxmgPa.Hh3pFjMyvhDLZbNJM1YXQwEMsR9DZ.q',
  '$2b$10$6L68Mn1XcfOSN0VWfTufbOh6tHRh9HwJiglUEcpMWk7yp2YW4qvXO',
];
const passwords = ['123456', 'password123', 'admin123', 'test1234', 'changeme', 'demo'];
for (const hash of hashes) {
  console.log('HASH', hash);
  for (const pwd of passwords) {
    const match = bcrypt.compareSync(pwd, hash);
    if (match) console.log(' MATCH', pwd);
  }
}
