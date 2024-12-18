import { defineConfig } from "tsup";

export default defineConfig((c) => ({
    entry: ["server/server.ts"],
    splitting: false,
    sourcemap: false,
    watch: c.watch,
    clean: false,
    target: "node18",
    format: "esm",
    outDir: "build/server",
    external: ["virtual:remix/server-build", "@remix-run/node", "lightningcss", "fs", "node:fs", "next-mdx-remote"],
    noExternal: ["hono", "isbot"]
}));
