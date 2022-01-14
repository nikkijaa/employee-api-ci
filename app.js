const express = require('express');
var cors = require('cors');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parse application/x-www-form-urlencoded
app.use(cors());

//Swagger //localhost:5000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use("/employees", require('./routes/employee-routes'));


//Client Side - configure error handlers
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV == "development") {
        console.error(err.stack);
    }
    res.status(500).send({ 'error': 'Something broke!' })
});

//Server side - configure error handlers
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV == "development") {
        console.error(err.stack);
    }
    res.status(500).send({ 'error': 'Something broke!' })
});


module.exports = app;
