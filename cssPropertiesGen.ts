import { writeFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import * as properties from "./src/properties.css";

const [writeFileAsync] = [writeFile].map(promisify);

(async () => {
  const keys = Object.keys(properties);
  await writeFileAsync(
    join(__dirname, "src", "properties.css"),
    `/* generated */\n:root {\n${keys.map(key => `  --${key.replace(/_/g, "-")}: ${properties[key]};\n`).join("")}}`
  )
})();
