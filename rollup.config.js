//@ts-check
import path from "path";
import { readFileSync } from "fs";
import postcss from "rollup-plugin-postcss";
import postcssNesting from "postcss-nesting";
import postcssCustomProperties from "postcss-custom-properties";
import postcssURL from "postcss-url";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import cssnano from "cssnano";
import visualizer from "rollup-plugin-visualizer";
import serve from "rollup-plugin-serve";

const localPkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const env = {
  API_ENV: process.env.API_ENV,
  NODE_ENV: process.env.NODE_ENV || "production"
};

export default async () => ({
  input: "src/index.jsx",
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
    commonjs({
      sourceMap: env.NODE_ENV === "production"
    }),
    esbuild({
      include: ["./src/*/*.js+(|x)", "./src/**/*.js+(|x)"],
      exclude: "node_modules/**",
      jsxFactory: 'h',
      define: {
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
        "process.env.VERSION": JSON.stringify(localPkg.version),
        "process.env.API_URL":
          env.API_ENV === "production" || env.NODE_ENV === "production"
            ? JSON.stringify("https://api.modwat.ch")
            : JSON.stringify("http://localhost:3001")
      }
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
      ].concat(env.NODE_ENV !== "production" ? [] : [cssnano()])
    })
  ].concat(
    env.NODE_ENV === "production"
      ? [
        visualizer({
            filename: `./node_modules/.visualizer/index.html`,
            title: `Modwatch Dependency Graph`,
            template: "treemap"
          })
        ]
      : []
  ).concat(process.env.ROLLUP_WATCH ? [
    serve({
      contentBase: "public",
      port: 5000,
      verbose: false,
      historyApiFallback: true,
    })
  ] : [])
});
