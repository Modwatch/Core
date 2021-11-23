//@ts-check
/** @typedef {import("@modwatch/types").Notification} Notification */

import { h } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import { useNotificationContext } from "../context/useNotifications";
import { defaultDelay, defaultRemovalDelay } from "../store";

export const infiniteDelay = -1;

export function ModwatchNotification({ notification }) {
  const { removeNotification } = useNotificationContext();
  const removingTimeout = useRef();
  const removeTimeout = useRef();
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (notification.delay !== infiniteDelay) {
      const { delay = defaultDelay, removalDelay = defaultRemovalDelay, _id } = notification;
      removingTimeout.current = setTimeout(() => {
        setRemoving(true);
      }, delay);
      removeTimeout.current = setTimeout(() => {
        removeNotification(_id);
      }, removalDelay + delay);
    }
    return () => {
      clearTimeout(removingTimeout.current);
      clearTimeout(removeTimeout.current);
    }
  }, []);

  const removeOnClick = () => {
    if (!removing) {
      clearTimeout(removingTimeout.current);
      clearTimeout(removeTimeout.current);
      setRemoving(true);
      removeTimeout.current = setTimeout(() => {
        removeNotification(notification._id);
      }, notification.removalDelay || 300);
      removingTimeout.current = undefined;
    } else {
      clearTimeout(removeTimeout.current);
      removeNotification(notification._id);
    }
  };

  return (
    <div
      key={notification._id}
      className={
        !notification.softDelete
          ? `notification ${notification.type || "info"}${
              removing ? " removing" : ""
            }`
          : "notification soft-delete"
      }
      style={{ transition: `opacity ${notification.removalDelay}ms ease, transform ${notification.removalDelay}ms ease` }}
      onClick={removeOnClick}
    >
      {notification.message}
    </div>
  );
}

export function ModwatchNotifications() {
  const { notifications }  = useNotificationContext();
  return (
    <span>
      {/* <pre><code>{JSON.stringify(notifications, null, 2)}</code></pre> */}
      <div className="notifications-wrapper">
        {notifications.map(notification => (
          <ModwatchNotification notification={notification} />
        ))}
      </div>
    </span>
  )
}
