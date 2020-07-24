import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import * as types from "@modwatch/types";

export const ModwatchNotification = ({ notification, onRemove }: {
  notification: types.Notification;
  onRemove(_id: string)
}) => {
  const [removingTimeout, setRemovingTimeout] = useState(undefined);
  const [removeTimeout, setRemoveTimeout] = useState(undefined);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (notification.delay !== -1) {
      const { delay = 5000, removalDelay = 300, _id } = notification;
      const removingTimeout = window.setTimeout(() => {
        setRemoving(true);
      }, delay);
      const removeTimeout = window.setTimeout(() => {
        onRemove(_id);
      }, removalDelay + delay);
      setRemoveTimeout(removeTimeout);
      setRemovingTimeout(removingTimeout);
    }
    return () => {
      clearTimeout(removingTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  function removeOnClick() {
    if (!removing) {
      clearTimeout(removingTimeout);
      setRemoving(true);
      const removeTimeout = window.setTimeout(() => {
        onRemove(notification._id);
      }, notification.removalDelay || 300);
      setRemoveTimeout(removeTimeout);
      setRemovingTimeout(undefined);
    } else {
      clearTimeout(removeTimeout);
      onRemove(notification._id);
    }
  }

  return (
    <div
      key={notification._id}
      class={
        !notification.softDelete
          ? `notification ${notification.type || "info"}${
              removing ? " removing" : ""
            }`
          : "soft-delete"
      }
      style={{ transition: `opacity ${notification.removalDelay}ms ease` }}
      onClick={removeOnClick}
    >
      {notification.message}
    </div>
  );
}

export const ModwatchNotifications = ({ notifications = [], removeNotification }: {
  notifications: types.Notification[];
  removeNotification(_id: string): void;
}) => (
  <div class="notifications-wrapper">
    {notifications.map(notification => (
      <ModwatchNotification
        notification={notification}
        onRemove={_id => removeNotification(_id)}
      />
    ))}
  </div>
)
