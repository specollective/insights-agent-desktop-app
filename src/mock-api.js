const fs = require('fs');
const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.post('/api/send_access_code', (req, res) => {
  res.json({ token: 'user-token' });
});

server.post('/api/confirm_access_code', (req, res) => {
  res.json({ survey_token: 'survey-token' });
});

server.use(jsonServer.rewriter({
  '/api/data_entries/': '/data_entries',
}));

function makeMockAPI() {
  console.log('starting mock API');

  fs.writeFileSync(
    'src/mock-api.json',
    JSON.stringify({ data_entries: []}),
  );

  const router = jsonServer.router('src/mock-api.json');

  server.use(middlewares);
  server.use(router);

  server.listen(3333, () => {
    console.log('Mock API is running');
  });
}

module.exports = makeMockAPI;
