const pg = require('./utils/pg')

module.exports = {
    getProductService: function getProductService() {
        // Define the service implementation
        const service = {
            ProductsService: {
                ProductsPort: {
                    // Create actions
                    CreateProduct: async function ({ name, about, price }, callback) {
                        if (!name || !about || !price) {
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
                        console.log("Received POST request with value", name, ',', about, 'and', price);
                        const product = await pg.sql`
                            INSERT INTO products (name, about, price)
                            VALUES (${name}, ${about}, ${price})
                            RETURNING *
                        `;
                        callback(product[0]);
                    },

                    // Get actions
                    GetProducts: async function (_, callback) {
                        console.log("Received GET request");

                        const product = await pg.sql`
                            SELECT * FROM products
                        `;
                        callback(product)
                    },

                    // Delete actions
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
                        await pg.sql`
                            DELETE FROM products WHERE id = ${id}
                        `;
                        callback({ response: "Success" })
                    },

                    // Patch actions
                    PatchProduct: async function ({ id, name, about, price }, callback) {
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

                        if (typeof (name) !== 'undefined') {
                            await pg.sql`
                                UPDATE products
                                SET name = ${name}
                                WHERE id = ${id}
                            `
                        }
                        if (typeof (about) !== 'undefined') {
                            await pg.sql`
                                UPDATE products
                                SET about = ${about}
                                WHERE id = ${id}
                            `
                        }
                        if (typeof (price) !== 'undefined') {
                            await pg.sql`
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
        return service;
    }
}