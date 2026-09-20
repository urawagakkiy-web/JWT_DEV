import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite の設定。React（JSX）を変換するプラグインだけを使う
export default defineConfig({
  plugins: [react()],
});
