import express from "express";
import api from "./config/config";
import bodyParser from "body-parser";


const request = require("request");
const serverless = require ("serverless-http");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/convert', (req, res) => {
    const fromCurrency = req.query.fr
    const toCurrency = req.query.to
    let amount:any = req.query.amount
    let q = fromCurrency + '_' + toCurrency;
    console.log('q:', q)
    console.log('amount:', amount)
  
    let url = api.url + 'convert?q=' + q + '&compact=ultra&apiKey=' + api.apiKey;

    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      
      let jsonObj = JSON.parse(body);
      let val = (jsonObj[Object.keys(jsonObj)[0]]);      
      let finalAmount:number = parseFloat(amount) * val
      console.log('finalAmount:', finalAmount)
      
      const result = {
          "Conversion Rate": JSON.parse(body),
          "Given from": `${amount} ${fromCurrency}`,
          "Converted to": `${finalAmount} ${toCurrency}`
      };
      res.send(result)
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