import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// WHY a plain default config: this project doesn't need path aliases,
// custom build targets, or plugins beyond React fast-refresh. Adding
// more here would be configuration for its own sake.
export default defineConfig({
  plugins: [react()],
});
