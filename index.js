import express from "express";
import jsonServer from "json-server";
import auth from "json-server-auth";
import path from "path";
import { fileURLToPath } from "url";

const server = express();

// --- Resolve correct path to db.json ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust this if your db.json is NOT inside a "data" folder
const dbFile = path.join(__dirname, "data", "db.json");
console.log("Using DB file:", dbFile);

// --- CORS ---
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

// --- json-server setup ---
const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults();

// same rules you had originally
const rules = auth.rewriter({
  products: 444,
  featured_products: 444,
  orders: 660,
  users: 600,
});

// expose db for json-server-auth
server.db = router.db;

// json-server middlewares
server.use(middlewares);

// auth + rules
server.use(rules);
server.use(auth);

// resources (products, orders, users, login, register, etc.)
server.use(router);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`JSON server with auth running on port ${PORT}`);
});
