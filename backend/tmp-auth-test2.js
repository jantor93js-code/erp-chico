async function run() {
  try {
    const url = 'http://127.0.0.1:3001/api/v1/auth/login';
    console.log('Request URL', url);
    const loginResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@chico.local', password: '123456' }),
    });
    console.log('FETCH READY', loginResp.status);
    const loginText = await loginResp.text();
    console.log('LOGIN TEXT', loginText);
  } catch (error) {
    console.error('ERROR', error);
  }
}
run();
