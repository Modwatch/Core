//@ts-check
/** @typedef {import("../../../src/types").GlobalState} GlobalState */
/** @typedef {import("../../../src/types").NotificationOptions} NotificationOptions */
/** @typedef {import("@modwatch/types").Notification} Notification */

import test from "ava";
import {
  addNotification,
  removeNotification,
  defaultType,
  defaultDelay,
  defaultRemovalDelay
} from "../../../src/store/index.js";

/** @type {GlobalState} */
const emptyState = {
  notifications: []
};

test("[addNotification] should require a message", (t) => {
  // @ts-ignore
  t.throws(() => addNotification(emptyState));
});

test("[addNotification] should add a given message", (t) => {
  const { notifications } = addNotification(emptyState, "hello there");
  t.is(notifications.length, 1);
  t.like(notifications[0], {
    message: "hello there"
  });
});

test("[addNotification] should add a given message with options", (t) => {
  const { notifications } = addNotification(emptyState, "hello there", {
    type: "error",
    delay: 12,
    removalDelay: 13
  });
  t.is(notifications.length, 1);
  t.like(notifications[0], {
    message: "hello there",
    type: "error",
    delay: 12,
    removalDelay: 13
  });
});

test("[addNotification] should add 3 messages in order", (t) => {
  const first = addNotification(emptyState, "why");
  const second = addNotification(first, "hello");
  const { notifications } = addNotification(second, "there");
  t.is(first.notifications.length, 1);
  t.is(second.notifications.length, 2);
  t.is(notifications.length, 3);
  t.like(notifications[0], { message: "why" });
  t.like(notifications[1], { message: "hello" });
  t.like(notifications[2], { message: "there" });
});

test("[removeNotification] should require an _id", (t) => {
  //@ts-ignore
  t.throws(() => removeNotification(emptyState));
});

test("[removeNotification] should require a valid _id", (t) => {
  const first = addNotification(emptyState, "hello there");
  t.throws(() => removeNotification(first, "not_a_real_id"));
});

test("[removeNotification] should remove a given valid _id", (t) => {
  const first = addNotification(emptyState, "hello there");
  t.is(first.notifications.length, 1);
  const { notifications } = removeNotification(first, first.notifications[0]._id);
  t.is(notifications.length, 0);
});

test("[removeNotification] should soft delete multiple given valid _ids, removing them fully when all are deleted", (t) => {
  const first = addNotification(emptyState, "why");
  const second = addNotification(first, "hello");
  const third = addNotification(second, "there");
  t.is(first.notifications.length, 1);
  t.is(second.notifications.length, 2);
  t.is(third.notifications.length, 3);
  const fourth = removeNotification(third, third.notifications[0]._id);
  t.is(fourth.notifications.length, 3);
  t.true(fourth.notifications[0].softDelete);
  t.false(fourth.notifications[1].softDelete);
  t.false(fourth.notifications[2].softDelete);
  const fifth = removeNotification(fourth, fourth.notifications[1]._id);
  t.is(fifth.notifications.length, 3);
  t.true(fifth.notifications[0].softDelete);
  t.true(fifth.notifications[1].softDelete);
  t.false(fifth.notifications[2].softDelete);
  const sixth = removeNotification(fifth, fifth.notifications[2]._id);
  t.is(sixth.notifications.length, 0);
});
