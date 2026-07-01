(async()=>{
  try{
    const r = await fetch('http://localhost:3001/api/v1/pmo/documents');
    const data = await r.json();
    if(!r.ok){
      console.error('STATUS', r.status);
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
    console.log(JSON.stringify(data, null, 2));
  }catch(e){
    console.error(e.message);
    process.exit(1);
  }
})();
