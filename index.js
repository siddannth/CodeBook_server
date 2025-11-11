import express from "express";
import jsonServer from "json-server";
import auth from "json-server-auth";

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

// this is your routes.json, inlined:
const routes = {
  "/products*": "/444/",
  "/featured_products*": "/444/",
  "/orders*": "/660/",
  "/users*": "/600/"
};

const rules = auth.rewriter(routes);

// expose db for json-server-auth
server.db = router.db;

// json-server middlewares (logger, static, etc.)
server.use(middlewares);

// mount everything under /api
server.use("/api", rules);
server.use("/api", auth);
server.use("/api", router);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`JSON server with auth running on port ${PORT}`);
});
