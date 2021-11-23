//@ts-check
/** @typedef {import("../types").GlobalState} GlobalState */
/** @typedef {import("../types").NotificationOptions} NotificationOptions */
/** @typedef {import("@modwatch/types").Notification} Notification */

export const defaultType = "info";
export const defaultDelay = 5000;
export const defaultRemovalDelay = 300;

let indexIdentifier = 0;

/**
 * @param {GlobalState} state
 * @param {string} message
 * @param {NotificationOptions} [notificationOptions]
 * @returns {GlobalState}
 */
export function addNotification(
  state,
  message,
  {
    type = defaultType,
    delay = defaultDelay,
    removalDelay = defaultRemovalDelay
  } = {}
) {
  if (!message) {
    throw new Error("message is required for notifications")
  }
  const _id = `${indexIdentifier++}`;
  return {
    ...state,
    notifications: [
      ...state.notifications,
      {
        message,
        removalDelay,
        delay,
        _id,
        type,
        softDelete: false
      }
    ]
  };
}

/**
 * @param {GlobalState} state
 * @param {string} _id
 * @returns {GlobalState}
 */
export function removeNotification(state, _id) {
  const [index, numberOfActive] = state.notifications
    .reduce(([foundIndex, numberOfActive], n, index) => {
      if (_id === n._id && !n.softDelete) {
        return [index, numberOfActive + 1];
      } else {
        return [foundIndex, !n.softDelete ? numberOfActive + 1 : numberOfActive];
      }
    }, [-1, 0]);
  if (numberOfActive === 1 && index !== -1) {
    indexIdentifier = 0;
    return {
      ...state,
      notifications: []
    };
  }
  if (index !== -1) {
    return {
      ...state,
      notifications: [
        ...state.notifications.slice(0, index),
        {
          ...state.notifications[index],
          softDelete: true
        },
        ...state.notifications.slice(index + 1)
      ]
    };
  }
  throw new Error(
    `Attempted to removeNotification: ${_id}, which does not exist in [${state.notifications
      .map(n => n._id)
      .join(",")}]`
  );
}
