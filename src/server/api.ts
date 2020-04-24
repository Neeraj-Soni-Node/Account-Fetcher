// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
import * as bodyParser from 'body-parser';
// @ts-ignore
import * as jsforce from 'jsforce';

let conn: any = new jsforce.Connection({});

const app = express();
app.use(helmet());
app.use(compression());
var jsonParser = bodyParser.json();
let loginResult: any;

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;

app.get('/api/v1/endpoint', (req: any, res: any) => {
    res.json({ success: true });
});
app.post('/api/login', jsonParser, async function (req: { body: any; }, res: { send: (arg0: { error?: any; data?: any; }) => void; }) {
    var loginData = req.body;
    try {
        loginResult = await conn.login(
            loginData.userName,
            loginData.passAndToken
        );
    } catch (e) {
        res.send({ error: e.message });
    }
    res.send({ data: loginResult });
});
app.get('/api/logout', jsonParser, function (req: any, res: { send: (arg0: { error?: any; data?: string; }) => void; }) {
    conn.logout(function (err) {
        if (err) { res.send({ error: err }); }
        res.send({ data: 'success' });
    });
});
app.get('/api/fetchRecords', jsonParser, function (req: any, res: { send: (arg0: { error?: any; data?: string; }) => void; }) {
    var records: any[] = [];
    conn.query("SELECT Id, Name FROM Account", function(err, result) {
        if (err) { return console.error(err); }
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
        result.records.forEach((item:any, index:number) => {
            records.push(item);
        });
        res.send({ data: JSON.stringify(records) });
    });
});
app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
    )
);
