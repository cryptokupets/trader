var express = require("express");
var { TraderServer } = require("trader-server");

require("dotenv").config();

const app = express();

app.use(express.static(__dirname + "/webapp"));

app.use("/odata", TraderServer.create());

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on ${port}`));
