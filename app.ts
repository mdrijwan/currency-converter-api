import express, { query } from "express";
import api from "./config/config";
import bodyParser from "body-parser";
import { mergeJSON } from "merge-json-file";
import { v4 as uuidv4 } from 'uuid';


var AWS = require("aws-sdk");
var fs = require("fs")
const request = require("request");
const serverless = require ("serverless-http");
// const jsonMerger = require("json-merger");

AWS.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "location";
let locationId = uuidv4()
var year = 2015;
var title = "The Big New Movie";

var params = {
    TableName:table,
    Item:{
        "locationId": locationId,
        "title": title,
        "info":{
            "plot": "Nothing happens at all.",
            "rating": 0
        }
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
    // console.log('URL', url)

    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      // console.log('body:', body);
      
      let jsonObj = JSON.parse(body);
      console.log('JSON:', jsonObj);
      let data = {
        data: jsonObj
      }
      res.send(data)
    }).pipe(fs.createWriteStream('./data/data.json'))
});

app.get('/save', (req, res) => {
  // const qs = req.query.keyword
  var data = []
  // data.table = []
  for(let char of "abcdefghijklmnopqrstuvwxyz" ){
    let qs = char
    let url = api.url + `region=${api.region}&locale=${api.locale}&limit=${api.limit}&object_type=${api.type_1}&object_type=${api.type_2}&object_type=${api.type_3}&object_type=${api.type_4}&query=` + qs
    request(url, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      let jsonObj = JSON.parse(body);
      
      // data = Object.assign(jsonObj);
      data.push(jsonObj)
      fs.writeFile("./data/all_data.json", JSON.stringify((data)))

      console.log("ALL DATA", data)
      mergeJSON("./data/data_all.json", jsonObj)
    }).pipe(fs.createWriteStream(`./data/data_${char}.json`))
    // var result = jsonMerger.mergeFiles([`data_${char}.json`]);
    // fs.writeFile('all_data.json', JSON.parse(result));
    // console.log('PRINT', result)
  }
  console.log("DATA", data)
  let resp = { message: "all data have been saved"};
  // var result = mergeJSON("data_a.json", "data_b.json");
  // console.log('PRINT', result)
  res.send(resp)
  
});


exports.handler = serverless(app)