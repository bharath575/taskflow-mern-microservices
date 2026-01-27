import dotenv from "dotenv";
dotenv.config();

//imports
import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Auth Service running on port ${PORT}`);
});