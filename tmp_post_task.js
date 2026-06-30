(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/v1/pmo/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbnRvcjkyLmpzQGdtYWlsLmNvbSIsInN1YiI6ImRkZDZjZWQ4LTFjZjEtNGU3Ny04YjkyLTg5NGY4ODc2OWMxYiIsInRlbmFudF9pZCI6ImQwN2Q5ZmZhLTkyNjctNDFkMC04YjQzLTE0ZGRiYjA4MjNhMCIsInJvbGUiOiJwbW8tYWRtaW4iLCJpYXQiOjE3ODI1MDI0OTksImV4cCI6MTc4MjU4ODg5OX0.eKVVsrgfCjIY1CzpAM4bDeEO_AX7Cj3t8SRxI539ZRk'
      },
      body: JSON.stringify({ projectId: '524be8b3-d07b-4faf-b693-5892b29bff59', titulo: 'Actividad prueba' }),
    });

    console.log('Status:', res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
  }
})();
