const express = require('express');
const request = require('request');
const crypto = require('crypto');
const fileupload = require('./fileupload.js');
const entitlements = require('./entitlements.json');
const app = express();

let targetHost = 'http://localhost:54321';
let port = 9000;
let host = '0.0.0.0';
let staticPath = 'static';
let uploadFolder = 'temp';
let environment = process.env.ENV || "production";
let uploadFeature = false;
let resetFeature = false;
let authFile = null;

const DEFAULT_ROLE = 'default';
const ADMIN_ROLE = 'admin';
let authTable = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(('/env'), (req, res) => {
  const role = isAuthenticated(req, res);
  if (!role) {
    return;
  }
  console.log("env:", environment);
  res.send({
    environment: environment,
    uploadFeature: uploadFeature,
    resetFeature: resetFeature || (role === ADMIN_ROLE),
  });
});

app.get('/api/*', (req,res) => {
  const role = isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!hasAccess(role, "GET", req, res)) {
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
  const role = isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!hasAccess(role, "POST", req, res)) {
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
  const role = isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!hasAccess(role, "PUT", req, res)) {
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
  const role = isAuthenticated(req, res);
  if (!role) {
    return;
  }
  if (!hasAccess(role, "DELETE", req, res)) {
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

const hasAccess = (role, method, req, res) => {
  const accessList4Role = entitlements[role];
  if (accessList4Role) {
    const allowedUrls = accessList4Role[method];
    if (allowedUrls) {
      for (let i in allowedUrls) {
        if (req.originalUrl.startsWith(allowedUrls[i])) {
          return true;
        }
      }
    }
  }
  // Not entitled...
  res.status(403).send('Forbidden.');
  return false;
};

const isAuthenticated = (req, res) => {
  if (!authTable) {
    return DEFAULT_ROLE;
  }
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');

  const credentials = authTable[login];
  if (credentials) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    if (credentials.password === hash.digest('hex')) {
      return credentials.role;
    }
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="project-scout"');
  res.status(401).send('Authentication required.');
  return null;
}

loadAuthFile = (file) => {
  if (file) {
    request.get(file, (error, response, body) => {
      if (response.statusCode == 200) {
        const lines = body.split('\n');
        lines && lines.map(line => {
          line = line.trim();
          if (!line.startsWith('#')) {
            const items = line.split(' ');
            if (items.length>=2) {
              authTable = authTable || {};
              authTable[items[0]] = {
                password: items[1],
                role: items.length>2 ? items[2] : DEFAULT_ROLE
              }
            }
          }
        });
      } else {
        console.log('error in loading auth-file: '+ response.statusCode);
        authTable = null;
      }
    });
  }
}

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
      case '--auth-file':
          if (j<args.length) {
            authFile = args[j++];
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

const server = app.listen(port, host, () => {
    console.log('Listening on port %d...', server.address().port);
});

loadAuthFile(authFile);
