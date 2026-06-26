const fetch = global.fetch || require('node-fetch');

async function run() {
  try {
    const loginResp = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@chico.local', password: '123456' }),
    });

    const loginText = await loginResp.text();
    console.log('LOGIN STATUS', loginResp.status);
    console.log('LOGIN BODY', loginText);

    if (!loginResp.ok) {
      return;
    }

    const loginJson = JSON.parse(loginText);
    const token = loginJson.access_token;
    console.log('TOKEN LENGTH', token ? token.length : 'null');

    const endpoints = [
      '/api/v1/configuration/areas',
      '/api/v1/configuration/processes',
      '/api/v1/configuration/document-types',
      '/api/v1/configuration/document-statuses',
      '/api/v1/pmo/clients',
      '/api/v1/pmo/programs',
      '/api/v1/pmo/initiatives',
      '/api/v1/pmo/projects',
    ];

    for (const ep of endpoints) {
      const res = await fetch('http://localhost:3001' + ep, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      console.log('ENDPOINT', ep, 'STATUS', res.status);
      console.log(text);
    }
  } catch (error) {
    console.error('ERROR', error);
  }
}

run();
