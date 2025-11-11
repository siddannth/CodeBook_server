import express from "express";
import jsonServer from "json-server";
import auth from "json-server-auth";
import fs from "fs";

const server = express();

// CORS
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// json-server + db.json
const router = jsonServer.router("./data/db.json");
const middlewares = jsonServer.defaults();

// load your routes.json
const routes = JSON.parse(fs.readFileSync("./routes.json", "utf-8"));
const rules = auth.rewriter(routes);

// expose db (json-server-auth uses this)
server.db = router.db;

// standard json-server middlewares
server.use(middlewares);

// mount everything under /api
server.use("/api", rules);
server.use("/api", auth);
server.use("/api", router);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`JSON server with auth running on port ${PORT}`);
});
