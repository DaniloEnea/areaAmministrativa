// @ts-nocheck
const express = require('express');
const bodyParser = require('body-parser');
const cryptoKeys = require('../assets/CryptoKeys.json');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let publicKey = cryptoKeys.PublicKey;

app.get('/api/GetPublicKey', (req, res) => {
  if (publicKey) {
    res.send(publicKey);
  } else {
    res.status(500).send({ error: 'Public key not available' });
  }
});

app.listen(port, () => {
  console.log(`Public Key API is running at http://localhost:${port}`);
});
