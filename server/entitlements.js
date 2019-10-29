const entitlements = require('./entitlements.json');

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
    
module.exports = {
    hasAccess,
};