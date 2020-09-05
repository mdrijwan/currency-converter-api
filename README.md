# Currency-Converter-Api
A sample app that implements currency conversion API.

**Project**

Implementing a NodeJS API to receive currency conversion rates from the following api:

> https://free.currconv.com/api/

## Getting Started

Clone the project repository by running the command below if you use SSH

```
git clone git@github.com:mdrijwan/createorder-api.git
```

If you use https, use this instead

```
git clone https://github.com/mdrijwan/createorder-api.git
```

Run the command below to install NPM dependencies

```
npm install
```

This project is built on stand alone TypeScript so no compilation needed. But you can compile the `TypeScript` files to `JavaScript` anyway

```
npm run compile
```

Then start the server and follow the instructions in the console.

```
npm run start
```

#### Let's get started!

***Methods***
- To see list of currencies
  + GET/dev/currencies

- To see list of countries
  + GET/dev/countries

- To convert the currencies (`pass the params in query`)
  + GET/dev/convert
  > Example: GET/localhost:3000/dev/convert?fr=USD&to=MYR
  
##### Demo Screenshot!
![demo](https://github.com/mdrijwan/currency-converter-api/blob/master/from_usd_to_myr.png)
  

