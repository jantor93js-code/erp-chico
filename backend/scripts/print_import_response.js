const fs = require('fs');
try{
  const raw = fs.readFileSync('import_response.json', 'utf16le');
  const obj = JSON.parse(raw);
  console.log(JSON.stringify(obj, null, 2));
}catch(e){
  console.error('ERR', e.message);
  process.exit(1);
}
