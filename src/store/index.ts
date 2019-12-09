import { Notification } from "@modwatch/types";

type GlobalState = {
  [key: string]: any,
  notifications: Notification[]
};

export function addNotification(
  state: GlobalState,
  message: string,
  {
    type = "info",
    delay = 5000,
    removalDelay = 300
  }: {
    type?: string;
    delay?: number;
    removalDelay?: number;
  } = {}
) {
  const _id = `${new Date().getTime()}`;
  return {
    ...state,
    notifications: state.notifications.concat({
      message,
      removalDelay,
      delay,
      _id,
      type,
      softDelete: false
    })
  };
}

export function removeNotification(state: GlobalState, _id: string) {
  const onlyActiveIndex = state.notifications
    .map(({ softDelete }) => softDelete)
    .indexOf(false);
  if (onlyActiveIndex === 0 && state.notifications[0]._id === _id) {
    return { 
      ...state,
      notifications: []
    };
  }
  const index = state.notifications.map(({ _id }) => _id).indexOf(_id);
  if (index !== -1) {
    return {
      ...state,
      notifications: state.notifications
        .slice(0, index)
        .concat({
          ...state.notifications[index],
          softDelete: true
        })
        .concat(state.notifications.slice(index + 1))
    };
  }
  throw new Error(`Attempted to removeNotification: ${_id}, which does not exist in [${state.notifications.map(n => n._id).join(",")}]`);
}
