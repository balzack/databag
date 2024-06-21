import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/databagSdk.ts", "src/AccountSession.ts", "src/AdminSession.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});
