require('dotenv').config();
const soap = require("soap");
const fs = require("node:fs");
const http = require("http");
const productsService = require("./src/productService")

const products = productsService.getProductService();

// http server example
const server = http.createServer(function (request, response) {
  response.end("404: Not Found: " + request.url);
});

server.listen(8000);

// Create the SOAP server
const xml = fs.readFileSync("config/productsService.wsdl", "utf8");
soap.listen(server, "/products", products, xml, function () {
  console.log("SOAP server for Products running at http://localhost:8000/products?wsdl");
});
