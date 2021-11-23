//@ts-check
import { h, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import { addNotification, removeNotification } from "../store";

/** @typedef {import("@modwatch/types").Notification} Notification */
/** @typedef {import("../types").NotificationOptions} NotificationOptions */
/** @typedef {import("../types").GlobalState } GlobalState */

export const NotificationContext = createContext({
  /** @type {Notification[]} notifications */
  notifications: [],
  /**
   * @param {string} message
   * @param {NotificationOptions} [options]
  */
  addNotification(message, options) {},
  /**
   * @param {string} message
   * @param {NotificationOptions} [options]
  */
  removeNotification(_id) {}
});

export const NotificationProvider = (props) => {
  const [notifications, setNotifications] = useState([]);

  const add = (message, options) => {
    setNotifications(addNotification({notifications}, message, options).notifications);
  }
  const remove = (_id) => {
    setNotifications(current => removeNotification({notifications: current}, _id).notifications);
  }

  return <NotificationContext.Provider value={{
    notifications,
    addNotification: add,
    removeNotification: remove
  }} {...props} />
}

export const useNotificationContext = () => useContext(NotificationContext);
