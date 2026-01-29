import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

// Configure CORS BEFORE routes
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// CRITICAL: Routes (with proxy) BEFORE body parsing
app.use(routes);

// Body parsing AFTER proxy routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log("👉 GATEWAY RECEIVED:", req.method, req.url);
  next();
});

app.get("/", (_, res) => {
  res.send("Gateway healthy 🚀");
});

export default app;
