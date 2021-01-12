import express, { query } from "express";
import api from "./config/config";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';

const _ = require("lodash");
var AWS = require("aws-sdk");
var fs = require("fs")
const request = require("request");
const serverless = require ("serverless-http");

AWS.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "location";
let locationId = uuidv4()


var params = {
    TableName:table,
    Item:{
        "locationId": locationId
    }
};
console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/data', (req, res) => {
    const qs = req.query.keyword
    let url = api.url + `region=${api.region}&locale=${api.locale}&limit=${api.limit}&object_type=${api.type_1}&object_type=${api.type_2}&object_type=${api.type_3}&object_type=${api.type_4}&query=` + qs

    request(url, function (error, response, body) {
      if (error){
        console.log('error:', error);
      }
      else{
        console.log('statusCode:', response && response.statusCode);
      }
      
      response = JSON.parse(body);
      console.log('JSON:', response);
      let data = {
        data: response
      }
      res.send(data)
    }).pipe(fs.createWriteStream('./data/data.json'))
});

app.get('/save', (req, res) => {
  var data = []
  for(let char of "0123456789abcdefghijklmnopqrstuvwxyz" ){
    let qs = char
    let url = api.url + `region=${api.region}&locale=${api.locale}&limit=${api.limit}&object_type=${api.type_1}&object_type=${api.type_2}&object_type=${api.type_3}&object_type=${api.type_4}&query=` + qs
    request(url, function (error, response, body) {
      response = JSON.parse(body);
      for (let i = 0; i < response.length; i++) {
        data.push(response[Object.keys(response)[i]])
      }
      fs.writeFile("./data/all_data.json", JSON.stringify((data)))
    }).pipe(fs.createWriteStream(`./data/data_${char}.json`))
    
  }
  let allData = fs.readFileSync('./data/all_data.json', 'utf8');
  let jsonData = JSON.parse(allData)

  var unique_data = _.uniq(jsonData, 'displayDescription'); 
  fs.writeFile("./data/unique_data.json", JSON.stringify((unique_data)))

  let resp = { 
    message: "all data have been saved",
    data: unique_data,
    totalCount: allData.length,
    uniqueCount: unique_data.length
  };
  res.send(resp)
});

exports.handler = serverless(app)