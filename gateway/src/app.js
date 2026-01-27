import express from "express";
import cors from "cors";
import routes from "./routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.get("/", (_, res) => {
    res.send("Gateway healthy 🚀");
});
export default app;
//# sourceMappingURL=app.js.map