const express = require("express");
const {receipt} = require("./receipt");
const app = express();

const PORT = process.env.PORT || 4000

app.get("/", (req, res) => {
    res.send("Yolo server up and running")
})

app.get("/receipt", (req, res) => {
    receipt(res)
})

app.listen(4000, () => {
    console.log(`Listening on port: ${PORT}`)
})
