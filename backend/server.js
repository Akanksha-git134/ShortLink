require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

/**
 * WHY connect before listening: if MongoDB is unreachable, we want the
 * process to fail fast at startup, not accept traffic it can't serve.
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
