import { h, Component } from "preact";
import { Link } from "preact-router";
import { getModlist } from "./api.js";

const gameMap = {
  skyrim: "Skyrim Classic",
  skyrimse: "Skyrim SE",
  fallout4: "Fallout 4"
};

export default class ModlistWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameDisplay: gameMap[props.game],
      filtering: false,
      filterTimeoutID: undefined,
      showInactiveMods: false,
      current: props.filetype,
      modlist: {
        files: {},
        plugins: [],
        tag: "",
        enb: "",
        timestamp: undefined,
        score: 0
      },
      isAdmin: props.user.scopes.indexOf("admin") !== -1
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.toggleActiveMods = this.toggleActiveMods.bind(this);
  }
  async componentDidMount() {
    const modlist = await getModlist({
      username: this.props.username
    });
    this.setState(() => ({ modlist }));
  }
  updateFilter(value) {
    console.log("Filtering!", value);
  }
  toggleActiveMods() {
    this.setState(({ showInactiveMods }) => ({
      showInactiveMods: !showInactiveMods
    }));
  }
  render(props, state) {
    const { user } = this.props;
    const showAdminTools = state.isAdmin || user.username === props.username;
    return (
      <div class="modlist-wrapper">
        <section class="modlist-meta">
          <p class="modlist-username">{props.username}</p>
          {state.modlist.enb && (
            <p class="modlist-enb">ENB: {state.modlist.enb}</p>
          )}
          {state.modlist.tag && (
            <p class="modlist-tag">Tag: {state.modlist.tag}</p>
          )}
          <p class="modlist-gamedisplay">{state.gameDisplay}</p>
          {state.showAdminTools && (
            <div class="modlist-actions">
              <button type="button" onClick={props.deleteModlist}>
                Delete
              </button>
            </div>
          )}
        </section>
        <section class="modlist-content">
          <nav class="modlist-filetype-nav">
            <ul>
              {state.modlist.files.map(t => (
                <li>
                  <Link to={`/u/${user.username}/${t}`} class="no-underline">
                    <button class={state.current === t && "active"}>
                      {state.filetypeMap[t]}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <form class="modlist-filter">
            <span class="form-group">
              <label
                for="modlist-filter"
                style="visibility: hidden; display: none;"
              >
                Filter
              </label>
              <input
                type="text"
                id="modlist-filter"
                placeholder="Filter By..."
                onInput={this.updateFilter}
              />
            </span>
            {state.current === "modlist" && (
              <span class="form-group">
                <label for="modlist-enabled-toggle">Inactive Mods</label>
                <input
                  type="checkbox"
                  id="modlist-enabled-toggle"
                  onChange={this.toggleActiveMods}
                />
              </span>
            )}
          </form>
          {/* <router-view /> */}
        </section>
      </div>
    );
  }
}

// export default {
//   computed: {
//     ...mapState({
//       modlist: state => state.modlist,
//       isAdmin: state => state.user.scopes.indexOf("admin") !== -1,
//       user: state => state.user.username
//     }),
//     showAdminTools() {
//       return this.isAdmin || this.username === this.user;
//     },
//     username() {
//       return this.$route.params.username;
//     },
//     gameDisplay() {
//       return this.gameMap[this.modlist.game];
//     },
//     files() {
//       return this.modlist.files
//         ? Object.keys(this.modlist.files).filter(f => this.modlist.files[f] > 0)
//         : [];
//     },
//     filetypeMap() {
//       return {
//         plugins: "plugins",
//         modlist: "modlist",
//         ini:
//           this.modlist.game.indexOf("skyrim") !== -1
//             ? "skyrim"
//             : this.modlist.game,
//         prefsini: `${
//           this.modlist.game.indexOf("skyrim") !== -1
//             ? "skyrim"
//             : this.modlist.game
//         }Prefs`
//       };
//     },
//     current() {
//       return this.$route.name || "plugins";
//     }
//   },
//   beforeRouteUpdate(to, from, next) {
//     if (from.params.username !== to.params.username) {
//       this.$store.dispatch("getModlist", to.params.username);
//     }
//     next();
//   },
//   data() {
//     return {
//       gameMap: {
//         skyrim: "Skyrim Classic",
//         skyrimse: "Skyrim SE",
//         fallout4: "Fallout 4"
//       },
//       filtering: false,
//       filterTimeoutID: undefined,
//       showInactiveMods: false
//     };
//   },
//   methods: {
//     updateFilter({ target }) {
//       if (this.filtering) {
//         clearTimeout(this.filterTimeoutID);
//       }
//       this.filtering = true;
//       this.filterTimeoutID = setTimeout(() => {
//         this.$store.commit("modlistfilter", target.value);
//         this.filtering = false;
//       }, 333);
//     },
//     toggleActiveMods() {
//       this.$store.commit("toggleActiveMods");
//     },
//     deleteModlist() {
//       if (window.confirm("Are you sure you want to delete this modlist?")) {
//         this.$store
//           .dispatch("deleteModlist", { username: this.username })
//           .then(deleted => {
//             if (deleted) {
//               if (this.username === this.user) {
//                 this.$store.dispatch("logout");
//               }
//               this.$router.push("/");
//             }
//           });
//       }
//     }
//   },
//   render(h) {
//     return (
// <div class="modlist-wrapper">
//   <section class="modlist-meta">
//     <p class="modlist-username">{this.username}</p>
//     {this.modlist.enb && (
//       <p class="modlist-enb">ENB: {this.modlist.enb}</p>
//     )}
//     {this.modlist.tag && (
//       <p class="modlist-tag">Tag: {this.modlist.tag}</p>
//     )}
//     <p class="modlist-gamedisplay">{this.gameDisplay}</p>
//     {this.showAdminTools && (
//       <div class="modlist-actions">
//         <button type="button" onClick={this.deleteModlist}>
//           Delete
//         </button>
//       </div>
//     )}
//   </section>
//   <section class="modlist-content">
//     <nav class="modlist-filetype-nav">
//       <ul>
//         {this.files.map(t => (
//           <li>
//             <router-link
//               to={`/u/${this.username}/${t}`}
//               class="no-underline"
//             >
//               <button class={this.current === t && "active"}>
//                 {this.filetypeMap[t]}
//               </button>
//             </router-link>
//           </li>
//         ))}
//       </ul>
//     </nav>
//     <form class="modlist-filter">
//       <span class="form-group">
//         <label
//           for="modlist-filter"
//           style="visibility: hidden; display: none;"
//         >
//           Filter
//         </label>
//         <input
//           type="text"
//           id="modlist-filter"
//           placeholder="Filter By..."
//           onInput={this.updateFilter}
//         />
//       </span>
//       {this.current === "modlist" && (
//         <span class="form-group">
//           <label for="modlist-enabled-toggle">Inactive Mods</label>
//           <input
//             type="checkbox"
//             id="modlist-enabled-toggle"
//             onChange={this.toggleActiveMods}
//           />
//         </span>
//       )}
//     </form>
//     <transition name="fade" mode="out-in">
//       <router-view />
//     </transition>
//   </section>
// </div>
//     );
//   },
//   created() {
//     this.$store.commit("modlistfilter");
//   }
// };
