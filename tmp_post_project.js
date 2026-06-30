(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/v1/pmo/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbnRvcjkyLmpzQGdtYWlsLmNvbSIsInN1YiI6ImRkZDZjZWQ4LTFjZjEtNGU3Ny04YjkyLTg5NGY4ODc2OWMxYiIsInRlbmFudF9pZCI6ImQwN2Q5ZmZhLTkyNjctNDFkMC04YjQzLTE0ZGRiYjA4MjNhMCIsInJvbGUiOiJwbW8tYWRtaW4iLCJpYXQiOjE3ODI1MDI0OTksImV4cCI6MTc4MjU4ODg5OX0.eKVVsrgfCjIY1CzpAM4bDeEO_AX7Cj3t8SRxI539ZRk'
      },
      body: JSON.stringify({ initiativeId: '7124b569-a3c6-4d2f-96ce-00ea20a9eac0', nombre: 'Proyecto prueba' }),
    });

    console.log('Status:', res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
  }
})();
