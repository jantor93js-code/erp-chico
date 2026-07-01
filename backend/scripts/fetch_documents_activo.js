(async()=>{
  try{
    const r = await fetch('http://localhost:3001/api/v1/pmo/documents?activo=all');
    const text = await r.text();
    console.log('STATUS', r.status);
    try{ console.log(JSON.parse(text)); }catch(e){ console.log(text); }
  }catch(e){ console.error('ERR', e.message); process.exit(1);} 
})();
