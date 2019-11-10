import { h, Component } from "preact";

import { Modlist } from "@modwatch/types";

type PrettyModlist = Partial<Modlist> & {
  encodedUsername: string;
  displayTimestamp: string;
};
type State = {
  modlists: PrettyModlist[];
  gameMap: {
    [key: string]: string;
  };
  debounceFilter?: number;
  filter: string;
}

export default class ModwatchModlists extends Component<
  {
    getModlists(): Promise<Partial<Modlist>[]>,
    searchModlists({ filter: string }): Promise<Partial<Modlist>[]>,
    Link: any
  },
  State
> {
  state: State = {
    modlists: [],
    gameMap: {
      skyrim: "Skyrim Classic",
      skyrimse: "Skryim SE",
      fallout4: "Fallout 4"
    },
    debounceFilter: undefined,
    filter: ""
  };
  componentDidMount = async () => {
    const modlists = await this.props.getModlists();
    this.setState(() => ({
      modlists: prettifyModlists(modlists)
    }));
  };
  search = (filter = "", debounce = 150) => {
    clearTimeout(this.state.debounceFilter);
    this.setState(() => ({
      filter,
      debounceFilter: window.setTimeout(async () => {
        if (filter === "") {
          const modlists = await this.props.getModlists();
          this.setState(() => ({
            modlists: prettifyModlists(modlists)
          }));
          return;
        }
        const modlists = await this.props.searchModlists({ filter });
        this.setState(() => ({
          modlists: prettifyModlists(modlists)
        }));
      }, debounce)
    }));
  };
  clear = () => {
    this.setState(() => ({
      filter: ""
    }));
    this.search(undefined, 0);
  };
  render() {
    return (
      <div>
        <form>
          <label for="modlists-search" class="sr-only">
            Search
          </label>
          <input
            type="text"
            placeholder="Search"
            id="modlists-search"
            value={this.state.filter}
            onInput={e => this.search((e.target as HTMLInputElement).value)}
          />
          <button type="button" onClick={this.clear}>
            Clear
          </button>
        </form>
        <table class="modlist-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Game</th>
              <th class="responsive-hide">
                Timestamp
              </th>
            </tr>
          </thead>
          {this.state.modlists.map(
            ({
              username,
              encodedUsername,
              game,
              displayTimestamp
            }) => (
              <tr>
                <td>
                  <this.props.Link href={`/u/${encodedUsername}`}>{username}</this.props.Link>
                </td>
                <td>{this.state.gameMap[game]}</td>
                <td class="responsive-hide">
                  {displayTimestamp}
                </td>
              </tr>
            )
          )}
        </table>
      </div>
    );
  }
}

function prettifyModlists(modlists: Partial<Modlist>[]): PrettyModlist[] {
  let t;
  return modlists.map(
    m => (
      (t = new Date(m.timestamp)),
      {
        ...m,
        game: m.game || "skyrim",
        encodedUsername: encodeURIComponent(m.username),
        displayTimestamp: t.toLocaleString()
      }
    )
  );
}
