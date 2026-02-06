const soap = require('soap');

soap.createClient("http://localhost:8000/publisher?wsdl", {}, function (err, client) {
    if (err) {
        console.error("Error creating SOAP client:", err);
        return;
    }
    client.CreatePublisher({name: "Ubisoft", location: "Montpellier, France"}, async function (err, result) {
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