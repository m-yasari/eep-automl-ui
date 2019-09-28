const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const targetHost = 'http://localhost:54321';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/', function(req,res) {
    //modify the url in any way you want
    console.log("request: ", req);
    //var newurl = 'https://www.external.com' 
    //request(newurl).pipe(res),
  
  });

app.get('/', express.static('static'));




/*

var headers = {}
for (var key in req.headers) {
  if (req.headers.hasOwnProperty(key)) {
    headers[key] = req.get(key)
  }
}
headers['host'] = 'final-host'

var newurl = 'http://final-host/...'
request.get({url:newurl, headers: headers }, function (error, response, body) {
  // debug response headers
  console.log(response.headers)
  // debug response body
  console.log(body)

  // copy response headers
  for (var key in response.headers) {
    if (response.headers.hasOwnProperty(key)) {
      res.setHeader(key, response.headers[key])
    }
  }
  res.send(response.statusCode, body)
})

*/
const server = app.listen(8090, () => {
    console.log('Listening on port %d...', server.address().port);
});
