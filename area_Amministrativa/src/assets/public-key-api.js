// @ts-nocheck
import express from 'express';
import bodyParser from 'body-parser';
import cryptoKeys from '../assets/CryptoKeys.json' assert { type: 'json' };

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
