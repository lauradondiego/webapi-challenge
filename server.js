const express = require("express");
const server = express();
const actionRouter = require("./api/actionModel-router");
const projectRouter = require("./api/projectModel-router");

server.use("/api/actions", actionRouter);
server.use("/api/projects", projectRouter);

module.exports = server;
