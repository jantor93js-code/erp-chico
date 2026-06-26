const fetch = global.fetch || require('node-fetch');

async function run() {
  try {
    const credentials = { email: 'jantor92.js@gmail.com', password: '123456' };
    console.log('LOGIN CREDENTIALS', JSON.stringify(credentials));

    const loginResp = await fetch('http://127.0.0.1:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const loginText = await loginResp.text();
    console.log('LOGIN STATUS', loginResp.status);
    console.log('LOGIN BODY', loginText);

    if (!loginResp.ok) return;
    const { access_token } = JSON.parse(loginText);
    console.log('ACCESS_TOKEN', access_token ? access_token.slice(0, 40) + '...' : 'null');

    const endpoints = [
      '/api/v1/configuration/areas',
      '/api/v1/configuration/processes',
      '/api/v1/configuration/document-types',
      '/api/v1/configuration/document-statuses',
    ];

    for (const ep of endpoints) {
      const res = await fetch('http://127.0.0.1:3001' + ep, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const text = await res.text();
      console.log('ENDPOINT', ep, 'STATUS', res.status);
      console.log('BODY', text);
    }
  } catch (error) {
    console.error('ERROR', error);
  }
}

run();
