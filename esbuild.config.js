import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const pagesDir = path.resolve("src/pages");
const distDir = path.resolve("dist");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.readdirSync(pagesDir).forEach((item) => {
  const itemPath = path.join(pagesDir, item);
  if (fs.statSync(itemPath).isDirectory()) {
    const pageDistDir = path.join(distDir, item);
    if (!fs.existsSync(pageDistDir)) {
      fs.mkdirSync(pageDistDir);
    }

    const tsEntry = path.join(itemPath, "index.ts");
    if (fs.existsSync(tsEntry)) {
      esbuild.buildSync({
        entryPoints: [tsEntry],
        bundle: true,
        minify: true,
        sourcemap: true,
        outfile: path.join(pageDistDir, "bundle.js"),
        target: ["es2020"],
      });
    }

    const htmlSrc = path.join(itemPath, "index.html");
    const htmlDest = path.join(pageDistDir, "index.html");
    if (fs.existsSync(htmlSrc)) {
      fs.copyFileSync(htmlSrc, htmlDest);
    }
  }
});

const rootIndexHtml = path.join(pagesDir, "index.html");
const rootIndexTs = path.join(pagesDir, "index.ts");

if (fs.existsSync(rootIndexHtml)) {
  fs.copyFileSync(rootIndexHtml, path.join(distDir, "index.html"));
}

if (fs.existsSync(rootIndexTs)) {
  fs.copyFileSync(rootIndexTs, path.join(distDir, "index.ts"));
}

execSync(
  "npx @tailwindcss/cli -i ./src/styles/tailwind.css -o ./dist/style.css --minify --config ./tailwind.config.js",
  { stdio: "inherit" }
);

console.log("✅ Build completed");
