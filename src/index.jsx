//@ts-check
/** @typedef {import("@modwatch/types").Notification} Notification */
/** @typedef {import("./types").GlobalState} GlobalState */

import { h, render } from "preact";

import { users, plugins, modlist, ini, prefsini } from "./__helpers__/mocks";

import "./global.css";

import "./components/modwatch-file.css";
import ModwatchFile from "./components/modwatch-file";
import "./components/modwatch-modlists.css";
import ModwatchModlists from "./components/modwatch-modlists";
import "./components/modwatch-nav.css";
import ModwatchNav from "./components/modwatch-nav";
import "./components/modwatch-notifications.css";
import { ModwatchNotifications } from "./components/modwatch-notifications";

import { NotificationProvider, useNotificationContext } from "./context/useNotifications";

const Root = () => {
  const { addNotification } = useNotificationContext();
  return (
    <div>
      <ModwatchNotifications />
      <header>
        <h1 className="header">
          <a className="no-underline" href="/">
            MODWATCH
          </a>
        </h1>
      </header>
      {/* @ts-ignore */}
      <ModwatchNav>
        <span className="nav-block" onClick={e => addNotification("Home")}>
          Home
        </span>
        <span className="nav-block" onClick={e => addNotification("Modlists")}>
          Modlists
        </span>
        <span className="nav-block" onClick={e => addNotification("Profile")}>
          Profile
        </span>
      </ModwatchNav>
      <div className="content-wrapper">
        <div className="view-wrapper">
          <section>
            <h2>This is a component library for Modwatch</h2>
            <p>
              These components can be shared between any modwatch-related
              apps. Notifications, modwatch file view, corner nav, etc. To
              test notifications, you can{" "}
              <a onClick={e => addNotification("A message!", { delay: -1 })}>click here</a> to
              push a new one. They should disappear after a few seconds, or on
              click.
            </p>
          </section>
          <section>
            <h2>Example Modwatch List</h2>
            <ModwatchModlists
              getModlists={async () => await users}
              searchModlists={async ({ filter }) => {
                const u = await users;
                const lowerFilter = filter.toLowerCase();
                return u.filter(({ username }) =>
                  username.toLowerCase().includes(lowerFilter)
                );
              }}
              Link={({ children, href }) => (
                <a onClick={e => addNotification(href)}>{children}</a>
              )}
            />
          </section>
          <section>
            <h2>Example Modlist</h2>
            {[["plugins", plugins], ["modlist", modlist], ["ini", ini], ["prefsini", prefsini]].map(([filetype, lines]) => (
              <div>
                <h3>{filetype}</h3>
                <ModwatchFile
                  lines={lines}
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

render(
  <NotificationProvider>
    {/* @ts-ignore */}
    <Root />
  </NotificationProvider>,
  document.getElementById("modwatch-app")
);
