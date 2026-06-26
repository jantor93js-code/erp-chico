const fetch = global.fetch || require('node-fetch');

async function run() {
  try {
    const newUser = {
      nombre: 'tmp auth user',
      email: 'tmp-auth-user@chico.local',
      password: 'tmpPass123!',
      scope: 'PMO',
      roleId: '8672512e-d510-4b3d-8039-911cae40d0fe',
      tenantId: 'd07d9ffa-9267-41c0-8b43-14ddbb0823a0',
    };

    console.log('CREATING USER', newUser.email);
    const createResp = await fetch('http://127.0.0.1:3001/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const createBody = await createResp.text();
    console.log('CREATE STATUS', createResp.status);
    console.log('CREATE BODY', createBody);

    if (!createResp.ok) {
      return;
    }

    console.log('LOGGING IN');
    const loginResp = await fetch('http://127.0.0.1:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newUser.email, password: newUser.password }),
    });
    const loginBody = await loginResp.text();
    console.log('LOGIN STATUS', loginResp.status);
    console.log('LOGIN BODY', loginBody);

    if (!loginResp.ok) {
      return;
    }

    const { access_token } = JSON.parse(loginBody);
    console.log('TOKEN', access_token ? access_token.slice(0, 40) + '...' : 'null');

    const endpoints = [
      '/configuration/areas',
      '/configuration/processes',
      '/configuration/document-types',
      '/configuration/document-statuses',
    ];

    for (const ep of endpoints) {
      const res = await fetch('http://127.0.0.1:3001/api/v1' + ep, {
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
