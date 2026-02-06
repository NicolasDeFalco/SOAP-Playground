const soap = require("soap");

soap.createClient("http://localhost:8000/products?wsdl", {}, function (err, client) {
  if (err) {
    console.error("Error creating SOAP client:", err);
    return;
  }
  // Make a SOAP request
  client.CreateProduct({ name: "My product", about: "A brand new product", price: 10.99 }, async function (err, result) {
    if (err) {
      console.error(
        "Error making SOAP request:",
        err.response.status,
        err.response.statusText,
        err.body
      );
      return;
    }
    
    console.log("Result:", result);
  });
});

soap.createClient("http://localhost:8000/products?wsdl", {}, function (err, client) {
  if (err) {
    console.error("Error creating SOAP client:", err);
    return;
  }
  client.GetProducts({}, async function (err, response) {
    if (err) {
      console.error(
        "Error making SOAP request:",
        err.response.status,
        err.response.statusText,
        err.body
      );
      return;
    }
    console.log('Result:', response);
    
  })
});

soap.createClient("http://localhost:8000/products?wsdl", {}, function (err, client) {
  if (err) {
    console.error("Error creating SOAP client:", err);
    return;
  }
  client.DeleteProduct({id: 71}, async function (err, result) {
    if (err) {
      console.error(
          "Error making SOAP request:",
          err.response.status,
          err.response.statusText,
          err.body
        );
        return;
    }
    console.log('Result:', result.response)
  });
})

soap.createClient("http://localhost:8000/products?wsdl", {}, function (err, client) {
  if (err) {
    console.error("Error creating SOAP client:", err);
    return;
  }
  client.PatchProduct({id: 1, price: 10.99}, async function(err, result) {
    if (err) {
      console.error(
          "Error making SOAP request:",
          err.response.status,
          err.response.statusText,
          err.body
        );
        return;
    }
    console.log('Result:', result.response)
  });
})
