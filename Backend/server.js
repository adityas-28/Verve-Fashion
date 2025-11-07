import { init } from "./Src/Config/db.js";
import app from "./Src/app.js";

init()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB init failed", err);
    process.exit(1);
  });
