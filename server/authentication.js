const fs = require('fs');
const crypto = require('crypto');
const constants = require('./constants.js');

let authTable = null;

const isAuthenticated = (req, res) => {
    if (!authTable) {
      return constants.DEFAULT_ROLE;
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
  
const loadAuthFile = (file) => {
    if (!file) { // no authetication
        authTable = null;
        return;
    }
    try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        lines && lines.map(line => {
            line = line.trim();
            if (!line.startsWith('#')) {
              const items = line.split(' ');
              if (items.length>=2) {
                authTable = authTable || {};
                authTable[items[0]] = {
                  password: items[1],
                  role: items.length>2 ? items[2] : constants.DEFAULT_ROLE
                }
              }
            }
        });
    } catch(err) {
        console.log('error in loading auth-file: '+ err);
        authTable = null;
    }
  };
  
  module.exports = {
    isAuthenticated,
    loadAuthFile,
  };
  