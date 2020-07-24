import path from "path";
import { readFile } from "fs";
import { promisify } from "util";
import postcss from "rollup-plugin-postcss";
import postcssNesting from "postcss-nesting";
import postcssCustomProperties from "postcss-custom-properties";
import postcssURL from "postcss-url";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "rollup-plugin-re";
import esbuild from "rollup-plugin-esbuild";

const localPkg = require("./package.json");

const readFileAsync = promisify(readFile);

const env = {
  API_ENV: process.env.API_ENV,
  NODE_ENV: process.env.NODE_ENV || "production"
};

export default async () => ({
  input: "src/index.tsx",
  output: {
    sourcemap: env.NODE_ENV !== "production" ? "inline" : true,
    exports: "named",
    dir: path.resolve(
      __dirname,
      `public/dist/`
    ),
    format: "umd"
  },
  context: null,
  moduleContext: null,
  treeshake: env.NODE_ENV === "production",
  watch: {
    clearScreen: false
  },
  plugins: [
    nodeResolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', ".ts", ".tsx"]
    }),
    replace({
      replaces: {
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
        "process.env.VERSION": JSON.stringify(localPkg.version),
        "process.env.API_URL":
          env.API_ENV === "production" || env.NODE_ENV === "production"
            ? JSON.stringify("https://api.modwat.ch")
            : JSON.stringify("http://localhost:3001")
      },
      patterns: (env.NODE_ENV !== "production" ? [{
        test: /(.*)\s*\/\/\/PROD_ONLY/g,
        replace: "// $1 // removed at build time"
      }] : [{
        test: /(.*)\s*\/\/\/DEV_ONLY/g,
        replace: "// $1 // removed at build time"
      }])
    }),
    commonjs({
      sourceMap: env.NODE_ENV === "production"
    }),
    esbuild({
      include: ["./src/*/*.ts+(|x)", "./src/**/*.ts+(|x)"],
      exclude: "node_modules/**",
      watch: process.argv.includes("--watch"),
      target: env.NOMODULE ? "es2015" : "es2016",
      jsxFactory: "h",
      jsxFragment: "Fragment",
      minify: env.NODE_ENV === "production"
    }),
    postcss({
      include: ["./src/*.css", "./src/**/*.css"],
      exclude: "node_modules/**",
      sourceMap: env.NODE_ENV === "production",
      modules: {
        scopeBehaviour: "global"
      },
      extract: true,
      plugins: [
        postcssNesting(),
        postcssCustomProperties({
          importFrom: "./src/properties.css",
          preserve: false
        }),
        postcssURL({
          url: "inline"
        })
      ].concat(env.NODE_ENV !== "production" ? [] : [require("cssnano")()])
    })
  ].concat(
    env.NODE_ENV === "production"
      ? [
          require("rollup-plugin-visualizer")({
            filename: `./node_modules/.visualizer/index.html`,
            title: `Modwatch Dependency Graph`,
            bundlesRelative: true,
            template: "treemap"
          })
        ]
      : []
  )
});
