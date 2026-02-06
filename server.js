require('dotenv').config();
const soap = require("soap");
const fs = require("node:fs");
const http = require("http");
const postgres = require("postgres");
	
const sql = postgres({ db: "soap-test", user: process.env.DB_USER, password: process.env.DB_PASSWORD });

// Define the service implementation
const service = {
  ProductsService: {
    ProductsPort: {
      CreateProduct: async function ({ name, about, price }, callback) {
        if (!name || !about || !price) {
          throw {
            Fault: {
              Code: {
                Value: "soap:Sender",
                Subcode: { value: "rpc:BadArguments" },
              },
              Reason: { Text: "Processing Error" },
              statusCode: 400,
            },
          };
        }
        console.log("Received POST request with value" , name, ',', about, 'and', price);
        const product = await sql`
          INSERT INTO products (name, about, price)
          VALUES (${name}, ${about}, ${price})
          RETURNING *
        `;
        callback(product[0]);
      },
      GetProducts: async function ( _ , callback) {
        console.log("Received GET request");
        
        const product = await sql`
          SELECT * FROM products
        `;
        callback(product)
      },
      DeleteProduct: async function ({ id }, callback) {
        if (!id) {
          throw {
            Fault: {
              Code: {
                Value: "soap:Sender",
                Subcode: { value: "rpc:BadArguments" },
              },
              Reason: { Text: "Processing Error: Id is missing." },
              statusCode: 400,
            },
          };
        }
        if (id === '0') {
          throw {
            Fault: {
              Code: {
                Value: "soap:Sender",
                Subcode: { value: "rpc:BadArguments" },
              },
              Reason: { Text: "Bad ID, cannot process id 0" },
              statusCode: 400,
            },
          };
        }
        
        console.log("Received DELETE request for products with id", id);      
        await sql`
          DELETE FROM products WHERE id = ${id}
        `;
        callback({ response: "Success" })
      },
      PatchProduct: async function ({id, name, about, price}, callback) {
        if (!id) {
          throw {
            Fault: {
              Code: {
                Value: "soap:Sender",
                Subcode: { value: "rpc:BadArguments" },
              },
              Reason: { Text: "Processing Error: Id is missing." },
              statusCode: 400,
            },
          };
        }
        if (!name && !about && !price) {
          throw {
            Fault: {
              Code: {
                Value: "soap:Sender",
                Subcode: { value: "rpc:BadArguments" },
              },
              Reason: { Text: "Processing Error: No new value given, request ignored." },
              statusCode: 400,
            },
          };
        }
        console.log("Received PATCH request for products with id", id);
        
        if (typeof(name) !== 'undefined') {
          await sql`
            UPDATE products
            SET name = ${name}
            WHERE id = ${id}
          `
        }
        if (typeof(about) !== 'undefined') {
          await sql`
            UPDATE products
            SET about = ${about}
            WHERE id = ${id}
          `
        }
        if (typeof(price) !== 'undefined') {
          await sql`
            UPDATE products
            SET price = ${price}
            WHERE id = ${id}
          `
        }
        callback({ response: "Success" });
      }
    },
  },
};

// http server example
const server = http.createServer(function (request, response) {
  response.end("404: Not Found: " + request.url);
});

server.listen(8000);

// Create the SOAP server
const xml = fs.readFileSync("productsService.wsdl", "utf8");
soap.listen(server, "/products", service, xml, function () {
  console.log("SOAP server running at http://localhost:8000/products?wsdl");
});
