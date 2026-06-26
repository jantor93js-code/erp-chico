const fetch = global.fetch || require('node-fetch');

async function run() {
  const base = 'http://127.0.0.1:3001/api/v1';
  const endpoints = [
    '/users',
    '/auth/login',
    '/configuration/areas',
  ];

  try {
    console.log('GET /users');
    const usersRes = await fetch(base + '/users');
    console.log('status', usersRes.status);
    const usersBody = await usersRes.text();
    console.log(usersBody);
  } catch (err) {
    console.error('USERS ERROR', err);
  }

  try {
    console.log('POST /auth/login admin');
    const loginRes = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@chico.local', password: '123456' }),
    });
    console.log('status', loginRes.status);
    console.log(await loginRes.text());
  } catch (err) {
    console.error('LOGIN ERROR', err);
  }

  try {
    console.log('GET /configuration/areas no auth');
    const confRes = await fetch(base + '/configuration/areas');
    console.log('status', confRes.status);
    console.log(await confRes.text());
  } catch (err) {
    console.error('CONFIG ERROR', err);
  }
}

run();
