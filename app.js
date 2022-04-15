require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const apiKey = process.env.MC_API_KEY;
  const listId = process.env.MC_LIST_ID;
  const dataCenter = process.env.DC;
  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}`;
  const options = {
    method: 'POST',
    auth: `aminah1:${apiKey}`
  }

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html')
    } else {
      res.sendFile(__dirname + '/failure.html')
    }
    response.on('data', (d) => {
      // console.log(JSON.parse(d))
    })
  })

  request.write(jsonData);

  request.on('error', (e) => {
    console.error(e);
  })

  request.end()
})

app.post('/failure', (req, res) => {
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`We are listening on port ${port} BABY!`);
})