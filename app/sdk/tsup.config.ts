import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/user.ts", "src/admin.ts", "src/account", "src/profile", "src/contact", "src/group", "src/attribute", "src/channel"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});
