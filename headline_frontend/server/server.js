const express = require('express');
var router = express.Router();
const app = express();
const querystring = require('querystring');
const axios = require('axios');

const port = '3001';

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.post('/api/search/labelbyuser', function (req, res) {
    var msg = {
        "defaultLabelList": [
            {
                "label": "label1",
                "score": 5
            },
            {
                "label": "label2",
                "score": 3
            }
        ],
        "choosedLabelList": [
            {
                "label": "label3",
                "score": 5
            },
            {
                "label": "label4",
                "score": 3
            }
        ]
    }
    res.end(msg);

})
app.listen(port, () => console.log('Example app listening on port ' + port + '!'))

