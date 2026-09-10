import app from "./src/app/app.js";
import connectDB from "./src/config/db.config.js";

await connectDB();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
