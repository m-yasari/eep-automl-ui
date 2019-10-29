const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const request = require('request');
const fileupload = require('./fileupload.js');
const entitlements = require('./entitlements.js');
const authentication = require('./authentication.js');
const constants = require('./constants.js');
const app = express();

let targetHost = 'http://localhost:54321';
let port = 9000;
let sslPort = 9443;
let host = '0.0.0.0';
let staticPath = 'static';
let uploadFolder = 'temp';
let environment = process.env.ENV || "production";
let uploadFeature = false;
let resetFeature = false;
let authFile = null;
let privateKeyFile = null;
let publicKeyFile = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(('/env'), (req, res) => {
  const role = authentication.isAuthenticated(req, res);
  if (!role) {
    return;
  }
  console.log("env:", environment);
  res.send({
    environment: environment,
    uploadFeature: uploadFeature,
    resetFeature: resetFeature || (role === constants.ADMIN_ROLE),
  });
});

app.get('/api/*', (req,res) => {
  const role = authentication.isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!entitlements.hasAccess(role, "GET", req, res)) {
    return;
  }
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("GET targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method,
    headers: {...req.headers}
  };
  request(options)
    .on('error', err => {
      console.log(err);
      res.status('504').send(`Failed connecting to engine: ${err.code}`);
    })
    .pipe(res);
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
  const role = authentication.isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!entitlements.hasAccess(role, "POST", req, res)) {
    return;
  }
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("POST targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method,
    headers: {...req.headers},
    body: prepareBody(req.body, req.headers)
  };
  request(options)
    .on('error', err => {
      console.log(err);
      res.status('504').send(`Failed connecting to engine: ${err.code}`);
    })
    .pipe(res);
});

app.put('/api/*', (req,res) => {
  const role = authentication.isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!entitlements.hasAccess(role, "PUT", req, res)) {
    return;
  }
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("PUT targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method,
    headers: {...req.headers},
    body: prepareBody(req.body, req.headers)
  };
  request(options)
    .on('error', err => {
      console.log(err);
      res.status('504').send(`Failed connecting to engine: ${err.code}`);
    })
    .pipe(res);
});

app.delete('/api/*', (req,res) => {
  const role = authentication.isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!entitlements.hasAccess(role, "DELETE", req, res)) {
    return;
  }
  const targetUrl = `${targetHost}${req.originalUrl.substring(4)}`;
  console.log("DELETE targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method,
    headers: {...req.headers},
    body: prepareBody(req.body, req.headers)
  };
  request(options)
    .on('error', err => {
      console.log(err);
      res.status('504').send(`Failed connecting to engine: ${err.code}`);
    })
    .pipe(res);
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
      case '--ssl-port':
        if (j<args.length) {
          let newSSLPort = parseInt(args[j++]);
          sslPort = isNaN(newSSLPort) ? sslPort : newSSLPort;
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
      case '--auth-file':
          if (j<args.length) {
            authFile = args[j++];
          }
          break;
      case '--private-key':
        if (j<args.length) {
          privateKeyFile = args[j++];
        }
        break;
      case '--public-key':
        if (j<args.length) {
          publicKeyFile = args[j++];
        }
        break;
      case '--upload-feature': // Only to use for Local machines
        uploadFeature = true;
        break;
      case '--reset-feature':
        resetFeature = true;
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

authentication.loadAuthFile(authFile);

const httpServer = http.createServer(app);
httpServer.listen(port, host, () => {
    console.log('Listening on port %d...', httpServer.address().port);
});

if (privateKeyFile && publicKeyFile) {
  const privateKey = fs.readFileSync(privateKeyFile, 'utf8');
  const certificate = fs.readFileSync(publicKeyFile, 'utf8');
  
  const credentials = {key: privateKey, cert: certificate};
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(sslPort, host, () => {
    console.log('Listening on SSL port %d...', httpsServer.address().port);
  });
}
