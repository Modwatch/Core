import { h, Component, render } from "preact";

import { modlists, modlist } from "./__helpers__/mocks";

import ModwatchFile from "./components/modwatch-file";
import ModwatchModlists from "./components/modwatch-modlists";
import ModwatchNav from "./components/modwatch-nav";
import { ModwatchNotifications } from "./components/modwatch-notifications";

import "./global.css";
import "./components/modwatch-file.css";
import "./components/modwatch-nav.css";
import "./components/modwatch-modlists.css";
import "./components/modwatch-notifications.css";

import * as types from "@modwatch/types";

class Root extends Component<{}, {
  notifications: types.Notification[]
}> {
  state = {
    notifications: []
  }
  pushNotification = () => {
    this.setState(({ notifications }) => ({
      notifications: notifications.concat({
        message: "A notification!",
        _id: `${new Date().getTime()}`
      })
    }));
  }
  removeNotifications = () => {
    this.setState(({ notifications }) => ({
      notifications: notifications.slice(1)
    }));
  }
  render() {
    return (
      <div>
        <ModwatchNotifications
          notifications={this.state.notifications}
          removeNotification={this.removeNotifications}
        />
        <header>
          <h1 class="header">
            <a class="no-underline" href="/">
              MODWATCH
            </a>
          </h1>
        </header>
        <ModwatchNav>
          <span class="nav-block" onClick={e => console.log("Home")}>Home</span>
          <span class="nav-block" onClick={e => console.log("Modlists")}>Modlists</span>
          <span class="nav-block" onClick={e => console.log("Profile")}>Profile</span>
        </ModwatchNav>
        <div class="content-wrapper">
          <div class="view-wrapper">
            <section>
              <h2>This is a component library for Modwatch</h2>
              <p>
                These components can be shared betweenany modwatch-related apps. Notifications, modwatch file view, corner nav, etc.
                To test notifications, you can <a onClick={this.pushNotification}>click here</a> to push a new one.
                They should disappear after a few seconds, or on click.
              </p>
            </section>
            <section>
              <h2>Example Modwatch List</h2>
              <ModwatchModlists getModlists={async () => await modlists} searchModlists={async () => await modlists} Link={({ children }) => <a>{children}</a>} />
            </section>
            <section>
              <h2>Example Modlist</h2>
              <ModwatchFile lines={modlist.modlist} filetype="modlist" complexLines={false} showDescriptor={true} filter="" showInactiveMods={true}/>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

render(<Root />, document.getElementById("modwatch-app"));