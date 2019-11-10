import { h, Component } from "preact";

import * as types from "@modwatch/types";

export class ModwatchNotification extends Component<
  { notification: types.Notification; onRemove(_id: string) },
  {
    removingTimeout?: number;
    removeTimeout?: number;
    removing: boolean;
  }
> {
  state = {
    removingTimeout: undefined,
    removeTimeout: undefined,
    removing: false
  };
  componentDidMount() {
    if (this.props.notification.delay !== -1) {
      const { onRemove } = this.props;
      const { delay = 5000, removalDelay = 300, _id } = this.props.notification;
      const removingTimeout = window.setTimeout(() => {
        this.setState({
          removing: true
        });
      }, delay);
      const removeTimeout = window.setTimeout(() => {
        onRemove(_id);
      }, removalDelay + delay);
      this.setState({
        removeTimeout,
        removingTimeout
      });
    }
  }
  removeOnClick = () => {
    const { onRemove, notification } = this.props;
    const { removingTimeout, removeTimeout, removing } = this.state;
    if (!removing) {
      clearTimeout(removingTimeout);
      clearTimeout(this.state.removeTimeout);
      this.setState({
        removing: true
      });
      const removeTimeout = window.setTimeout(() => {
        onRemove(notification._id);
      }, notification.removalDelay || 300);
      this.setState({
        removeTimeout,
        removingTimeout: undefined
      });
    } else {
      clearTimeout(removeTimeout);
      onRemove(notification._id);
    }
  };
  componentWillUnmount() {
    clearTimeout(this.state.removingTimeout);
    clearTimeout(this.state.removeTimeout);
  }
  render() {
    const { notification } = this.props;
    const { removing } = this.state;
    return (
      <div
        key={notification._id}
        class={!notification.softDelete ? `notification ${notification.type || "info"}${removing ? " removing" : ""}` : "soft-delete"}
        style={{transition: `opacity ${notification.removalDelay}ms ease`}}
        onClick={this.removeOnClick}
      >
        {notification.message}
      </div>
    );
  }
}

export class ModwatchNotifications extends Component<{
  notifications: types.Notification[],
  removeNotification(_id: string): void;
}, {}> {
  render() {
    const { notifications, removeNotification } = this.props;
    return (
      <div class="notifications-wrapper">
        {notifications.map(notification => (
          <ModwatchNotification
            notification={notification}
            onRemove={_id => removeNotification(_id)}
          />
        ))}
      </div>
    );
  }
}
