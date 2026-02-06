const postgres = require("postgres");

module.exports = {
    sql: postgres({ db: "soap-test", user: process.env.DB_USER, password: process.env.DB_PASSWORD }),
}