//@ts-check
/** @typedef {import("@modwatch/types").Line} Line */

import { h } from "preact";

/**
 * @param {Object} props
 * @param {string[]} props.lines
 * @param {boolean} props.complexLines
 * @param {boolean} props.showDescriptor
 * @param {string} [props.filetype]
 * @param {string} props.filter
 * @param {boolean} props.showInactiveMods
 */
function ModwatchFile({
  lines = [],
  complexLines = false,
  showDescriptor = false,
  filetype,
  filter = "",
  showInactiveMods = false
}) {
  return (
    <div>
      <ul>
        {(!complexLines
          ? lines.map((line, index) =>
              stringToSimpleLine(
                line,
                index,
                filetype,
                filter.toLowerCase(),
                showInactiveMods
              )
            )
          : lines.map((line, index) =>
              stringToComplexLine(line, index, filter.toLowerCase())
            )
        ).map(
          line =>
            !line.hide && (
              <li
                class={`modlist-item ${
                  line.descriptor ? line.descriptor : ""
                } ${line.type ? line.type : ""}`}
              >
                <span className="modlist-item-index unselectable">
                  {line.index}.
                </span>
                <span className="modlist-item-content">
                  {line.content.map(chunk => (
                    <span class={chunk.class}>{chunk.display}</span>
                  ))}
                </span>
                <span className="modlist-item-descriptor">
                  {showDescriptor && line.descriptor !== "comment"
                    ? line.descriptor
                    : ""}
                </span>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

const typeMap = {
  b: "type-boolean",
  s: "type-string",
  i: "type-integer",
  u: "type-unsigned",
  f: "type-float",
  r: "type-color"
};

const modlistMap = {
  "*": "unmanaged",
  "+": "enabled",
  "-": "disabled"
};

/**
 * @param {string} originalLine
 * @param {number} index
 * @param {string} filetype
 * @param {string} filter
 * @param {boolean} showInactiveMods
 * @returns {Line}
 */
export function stringToSimpleLine(
  originalLine,
  index,
  filetype,
  filter,
  showInactiveMods
) {
  const hide =
    (filter === "" ? false : !originalLine.toLowerCase().includes(filter)) ||
    (filetype === "modlist" && !showInactiveMods && originalLine[0] === "-");
  return hide
    ? {
        hide: true,
        index: index + 1
      }
    : {
        descriptor:
          filetype === "plugins"
            ? originalLine.slice(-3)
            : modlistMap[originalLine[0]],
        index: index + 1,
        content: [
          {
            class: "",
            display: originalLine
          }
        ]
      };
}

/**
 * @param {string} originalLine
 * @param {number} index
 * @param {string} filter
 * @returns {Line}
 */
export function stringToComplexLine(
  originalLine,
  index,
  filter
) {
  const hide =
    filter === ""
      ? false
      : !originalLine.toLowerCase().includes(filter.toLowerCase());
  if (hide) {
    return {
      hide: true,
      index: index + 1
    };
  }
  const descriptor =
    originalLine[0] !== ";"
      ? originalLine[0] !== "["
        ? "setting"
        : "section"
      : "comment";
  const commentIndex = originalLine.indexOf(";");
  if (
    (descriptor === "setting" && commentIndex === -1) ||
    commentIndex > originalLine.indexOf("=")
  ) {
    const [key, value, comment] = originalLine.split(/[=;]/g, 3);
    return {
      descriptor,
      type: typeMap[originalLine[0]],
      index: index + 1,
      content: [
        {
          class: "key",
          display: key
        },
        {
          class: "assign",
          display: "="
        },
        {
          class: "value",
          display: value
        }
      ].concat(
        comment
          ? {
              class: "comment",
              display: comment
            }
          : []
      )
    };
  } else {
    return {
      descriptor,
      index: index + 1,
      content: [
        {
          class: "",
          display: originalLine
        }
      ]
    };
  }
}

export default ModwatchFile;
