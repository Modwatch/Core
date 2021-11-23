//@ts-check
/** @typedef {import("../types").PrettyModlist} PrettyModlist */
/** @typedef {import("../types").ModlistsState} State */
/** @typedef {import("@modwatch/types").Modlist} Modlist */
/** @typedef {import("preact").ComponentType} ComponentType */

import { h } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";

export const gameMap = {
  skyrim: "Skyrim Classic",
  skyrimse: "Skryim SE",
  fallout4: "Fallout 4"
};
export const defaultDebounceRate = 150;

/**
 * @param {Object} props
 * @param {number} props.debounceRate
 * @param {() => Promise<Partial<Modlist>[]>} props.getModlists
 * @param {({ filter: string }) => Promise<Partial<Modlist>[]>} props.searchModlists
 * @param {ComponentType<{ href: string; [key: string]: any }>} props.Link
 * @component
 */
function ModwatchModlists({
  debounceRate = defaultDebounceRate,
  getModlists,
  searchModlists,
  Link
}) {
  const [modlists, setModlists] = useState([]);
  const [filteredModlists, setFilteredModlists] = useState(null);
  const [filter, setFilter] = useState("");
  const debounceFilter = useRef();
  
  useEffect(() => {
    const populateModlist = async () => {
      const modlists = await getModlists();
      setModlists(prettifyModlists(modlists));
    };
    populateModlist();
  }, []);

  useEffect(() => {
    clearTimeout(debounceFilter.current);
    debounceFilter.current = setTimeout(async () => {
      if (filter !== "") {
        setFilteredModlists(prettifyModlists(await searchModlists({ filter })))
      } else {
        setFilteredModlists(null);
      }
    }, debounceRate);
  }, [filter]);

  return (
    <div>
      <form>
        <label for="modlists-search" className="sr-only">
          Search
        </label>
        <input
          type="text"
          placeholder="Search"
          id="modlists-search"
          value={filter}
          // @ts-ignore
          onInput={e => setFilter(e.target.value)}
        />
        <button type="button" onClick={() => setFilter("")}>
          Clear
        </button>
      </form>
      <table className="modlist-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Game</th>
            <th className="responsive-hide">Timestamp</th>
          </tr>
        </thead>
        {(filteredModlists || modlists).map(
          ({ username, encodedUsername, game, displayTimestamp }) => (
            <tr>
              <td>
                <Link href={`/u/${encodedUsername}`}>
                  {username}
                </Link>
              </td>
              <td>{gameMap[game]}</td>
              <td className="responsive-hide">{displayTimestamp}</td>
            </tr>
          )
        )}
      </table>
    </div>
  );
}

/**
 * 
 * @param {Partial<Modlist>[]} modlists 
 * @returns {PrettyModlist[]}
 */
export function prettifyModlists(modlists) {
  return modlists.map(m => ({
    ...m,
    game: m.game || "skyrim",
    encodedUsername: encodeURIComponent(m.username),
    displayTimestamp: new Date(m.timestamp).toLocaleString()
  }));
}

export default ModwatchModlists;
