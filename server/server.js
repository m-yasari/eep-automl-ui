const express = require('express');
const request = require('request');
const fileupload = require('./fileupload.js');
const app = express();

let targetHost = 'http://localhost:54321';
let port = 9000;
let host = '0.0.0.0';
let staticPath = 'static';
let uploadFolder = 'temp';
let environment = process.env.ENV || "production";
let uploadFeature = false;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(('/env'), (req, res) => {
  console.log("env:", environment);
  res.send({
    environment: environment,
    uploadFeature: uploadFeature
  });
});

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

app.delete('/api/*', (req,res) => {
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("DELETE targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method,
    headers: {...req.headers},
    body: prepareBody(req.body, req.headers)
  };
  return request(options).pipe(res);
});

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
      case '--static-path':
        if (j<args.length) {
          staticPath = args[j++];
        }
        break;
      case '--upload-feature': // Only to use for Local machines
        uploadFeature = true;
        break;
    }
  }
  console.log(`Environment: \x1b[32m${environment}\x1b[0m`);
  console.log(`Bound to: \x1b[32m${host}:${port}\x1b[0m`);
  console.log(`Target host: \x1b[32m${targetHost}\x1b[0m`);
  console.log(`Static path: \x1b[32m${staticPath}\x1b[0m`);
  console.log(`Upload folder: \x1b[32m${uploadFolder}\x1b[0m`);
}

processArguments(process.argv);
app.use(express.static(staticPath));
fileupload.initialize(app, uploadFolder);

const server = app.listen(port, host, () => {
    console.log('Listening on port %d...', server.address().port);
});
