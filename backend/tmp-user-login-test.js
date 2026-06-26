const fetch = global.fetch || require('node-fetch');

async function run() {
  try {
    const newUser = {
      nombre: 'test auth',
      email: 'test-auth@chico.local',
      password: 'test1234',
      scope: 'PMO',
      roleId: '8672512e-d510-4b3d-8039-911cae40d0fe',
      tenantId: 'd07d9ffa-9267-41c0-8b43-14ddbb0823a0',
    };

    const createResp = await fetch('http://127.0.0.1:3001/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const createText = await createResp.text();
    console.log('CREATE USER STATUS', createResp.status);
    console.log('CREATE USER BODY', createText);

    const loginResp = await fetch('http://127.0.0.1:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newUser.email, password: newUser.password }),
    });
    const loginText = await loginResp.text();
    console.log('LOGIN STATUS', loginResp.status);
    console.log('LOGIN BODY', loginText);
    if (!loginResp.ok) return;
    const { access_token } = JSON.parse(loginText);
    console.log('TOKEN', access_token ? access_token.slice(0, 20) + '...' : 'null');

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
      const res = await fetch('http://127.0.0.1:3001' + ep, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
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
