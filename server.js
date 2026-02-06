require('dotenv').config();
const soap = require("soap");
const fs = require("node:fs");
const http = require("http");

// Service exports
const productsService = require("./src/productService")
const publisherService = require("./src/publisherService")

// Service configuration
const products = productsService.getProductService();
const publisher = publisherService.getPublisherService();

// http server example
const server = http.createServer(function (request, response) {
  response.end("404: Not Found: " + request.url);
});

server.listen(8000);

// Creating the SOAP servers

// Product Service
const xmlProduct = fs.readFileSync("config/productsService.wsdl", "utf8");
soap.listen(server, "/products", products, xmlProduct, function () {
  console.log("SOAP server for Products running at http://localhost:8000/products?wsdl");
});

const xmlPublisher = fs.readFileSync("config/publisherService.wsdl", "utf-8");
soap.listen(server, "/publisher", publisher, xmlPublisher, function () {
  console.log("SOAP server for Publisher running at http://localhost:8000/publisher?wsdl");
});

