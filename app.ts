import express from "express";
import api from "./config/config";
import bodyParser from "body-parser";


const request = require("request");
const serverless = require ("serverless-http");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/convert', (req, res) => {
    const fromCurrency = req.query.from
    const toCurrency = (req.query.to)
    let amount:any = req.query.amount
    let q = fromCurrency + '_' + toCurrency;
    console.log('q:', q)
  
    let url = api.url + 'convert?q=' + q + '&apiKey=' + api.apiKey;

    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      
      let jsonObj = JSON.parse(body).results;
      let val = (jsonObj[Object.keys(jsonObj)[0]].val);
      let id = (jsonObj[Object.keys(jsonObj)[0]].id);
      let convertedAmount = parseFloat(amount) * val
      
      const result = {
        query: {
          from: fromCurrency,
          to: toCurrency,
          amount: parseFloat(amount)
        },
        results: {
          id: id,
          rate: val,
          convertedAmount: parseFloat(convertedAmount.toFixed(4))
        }
          
      };
      res.send(result)
    })
});

app.get('/currencies', (req, res) => {
    let url = api.url + "currencies?" + '&apiKey=' + api.apiKey;
    
    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.send(JSON.parse(body))
    })
});

app.get('/countries', (req, res) => {
    let url = api.url + "countries?" + '&apiKey=' + api.apiKey;
    
    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.send(JSON.parse(body))
    })
})

exports.handler = serverless(app)