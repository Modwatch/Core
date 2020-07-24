import { h, Component, render } from "preact";

import { modlists, modlist } from "./__helpers__/mocks";

import "./global.css";

import "./components/modwatch-file.css";
import ModwatchFile from "./components/modwatch-file";
import ModwatchModlists from "./components/modwatch-modlists";
import "./components/modwatch-nav.css";
import ModwatchNav from "./components/modwatch-nav";
import "./components/modwatch-notifications.css";
import { ModwatchNotifications } from "./components/modwatch-notifications";

import { addNotification, removeNotification } from "./store/index";

import * as types from "@modwatch/types";

class Root extends Component<
  {},
  {
    notifications: types.Notification[];
  }
> {
  state = {
    notifications: []
  };
  notify = message => {
    this.setState(state => addNotification(state, message));
  };
  removeNotification = _id => {
    this.setState(state => removeNotification(state, _id));
  };
  render() {
    return (
      <div>
        <ModwatchNotifications
          notifications={this.state.notifications}
          removeNotification={this.removeNotification}
        />
        <header>
          <h1 class="header">
            <a class="no-underline" href="/">
              MODWATCH
            </a>
          </h1>
        </header>
        <ModwatchNav>
          <span class="nav-block" onClick={e => this.notify("Home")}>
            Home
          </span>
          <span class="nav-block" onClick={e => this.notify("Modlists")}>
            Modlists
          </span>
          <span class="nav-block" onClick={e => this.notify("Profile")}>
            Profile
          </span>
        </ModwatchNav>
        <div class="content-wrapper">
          <div class="view-wrapper">
            <section>
              <h2>This is a component library for Modwatch</h2>
              <p>
                These components can be shared between any modwatch-related
                apps. Notifications, modwatch file view, corner nav, etc. To
                test notifications, you can{" "}
                <a onClick={e => this.notify("A message!")}>click here</a> to
                push a new one. They should disappear after a few seconds, or on
                click.
              </p>
            </section>
            <section>
              <h2>Example Modwatch List</h2>
              <ModwatchModlists
                getModlists={async () => await modlists}
                searchModlists={async ({ filter }) => (await modlists).filter(m => m.username.toLowerCase().includes(filter.toLowerCase()))}
                Link={({ children, href }) => (
                  <a onClick={e => this.notify(href)}>{children}</a>
                )}
              />
            </section>
            <section>
              <h2>Example Modlist</h2>
              {["plugins", "modlist", "ini", "prefsini"].map(filetype => (
                <div>
                  <h3>{filetype}</h3>
                  <ModwatchFile
                    lines={modlist[filetype]}
                    filetype={filetype}
                    complexLines={filetype.includes("ini")}
                    showDescriptor={filetype === "plugins"}
                    filter=""
                    showInactiveMods={true}
                  />
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    );
  }
}

render(<Root />, document.getElementById("modwatch-app"));
