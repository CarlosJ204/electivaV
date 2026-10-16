import { connectDB } from "./lib/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});