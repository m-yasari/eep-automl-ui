const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();

let targetHost = 'http://localhost:54321';
let port = 9000;
let host = '0.0.0.0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/*', (req,res) => {
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("GET targetUrl:", targetUrl);
  return request({
    url: targetUrl,
    method: req.method,
    headers: {...req.headers}
  }).pipe(res);
});

const prepareFormData = (data) => {
  let bodyArr = [];
  Object.keys(data).map(param => {
      bodyArr.push(`${param}=${encodeURIComponent(data[param])}`);
  });
  return bodyArr.join('&');
};

const prepareBody = (bodyObject, headers) => {
  const contentTypeKey = Object.keys(headers).filter(key => (
    key.toLowerCase() == 'content-type'));
  const contentType = contentTypeKey && headers[contentTypeKey[0]];
  return (contentType && contentType.startsWith('application/json')) ?
      JSON.stringify(bodyObject) :
      prepareFormData(bodyObject);

};

app.post('/api/*', (req,res) => {
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("POST targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method,
    headers: {...req.headers},
    body: prepareBody(req.body, req.headers)
  };
  return request(options).pipe(res);
});

app.put('/api/*', (req,res) => {
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("PUT targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method,
    headers: {...req.headers},
    body: prepareBody(req.body, req.headers)
  };
  return request(options).pipe(res);
});

app.use(express.static('static'));

processArguments = (args) => {
  for (let j = 0; j < args.length; ) {
    switch(args[j++]) {
      case '--target-host':
        if (j<args.length) {
          targetHost = args[j++];
          if (targetHost.endsWith('/')) {
            targetHost = targetHost.substr(0, targetHost.length-1);
          }
        }
        break;
      case '--port':
        if (j<args.length) {
          let newPort = parseInt(args[j++]);
          port = isNaN(newPort) ? port : newPort;
        }
        break;
      case '--host':
        if (j<args.length) {
          host = args[j++];
        }
        break;
    }
  }
  console.log(`Bound to: \x1b[32m${host}:${port}\x1b[0m`);
  console.log(`Target host: \x1b[32m${targetHost}\x1b[0m`);
}

processArguments(process.argv);
const server = app.listen(port, host, () => {
    console.log('Listening on port %d...', server.address().port);
});
