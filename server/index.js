import express from "express";

const app = express();

const desirePort = 4000;
app.listen(desirePort);
console.log("Server on port http://localhost:" + desirePort);
