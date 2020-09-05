import express from "express";
import api from "./config/config";

const request = require("request");
const serverless = require ("serverless-http");

let app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get('/convert', (req, res) => {
    const fromCurrency = req.query.fr
    const toCurrency = req.query.to
    let qs = fromCurrency + '_' + toCurrency;
  
    let url = api.url + 'convert?q=' + qs + '&compact=ultra&apiKey=' + api.apiKey;

    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.send(JSON.parse(body))
    })
});

app.get('/currencies', (req, res) => {
    let url = api.url + "currencies?" + '&compact=ultra&apiKey=' + api.apiKey;
    
    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.send(JSON.parse(body))
    })
});

app.get('/countries', (req, res) => {
    let url = api.url + "countries?" + '&compact=ultra&apiKey=' + api.apiKey;
    
    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.send(JSON.parse(body))
    })
})

exports.handler = serverless(app)