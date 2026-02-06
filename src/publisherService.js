const pg = require('./utils/pg')

module.exports = {
    getPublisherService: function getPublisherService() {
        const service = {
            PublisherService: {
                PublisherPort: {
                    CreatePublisher: async function ({name, location}, callback) {
                        if (!name || !location) {
                            throw {
                                Fault: {
                                    Code: {
                                        Value: "soap:Sender",
                                        Subcode: { value: "rpc:BadArguments" },
                                    },
                                    Reason: { Text: "Processing Error: Missing argument in request" },
                                    statusCode: 400,
                                },
                            };
                        }
                        console.log("Received POST request on 'publisher' with value", name, 'and', location);
                        const publisher = await pg.sql`
                            INSERT INTO publisher (name, location)
                            VALUES (${name}, ${location})
                            RETURNING *
                        `;
                        
                        callback(publisher[0]);
                    }
                }
            }
        };
        return service;
    }
}