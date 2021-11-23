import { Notification, Modlist } from "@modwatch/types";

export type GlobalState = {
  [key: string]: any;
  notifications: Notification[];
};

export type NotificationOptions = {
  type?: string;
  delay?: number;
  removalDelay?: number;
};

export type JWT = {
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
  scopes: string[];
};

export type PrettyModlist = Partial<Modlist> & {
  encodedUsername: string;
  displayTimestamp: string;
};

export type ModlistsState = {
  modlists: PrettyModlist[];
  gameMap: {
    [key: string]: string;
  };
  debounceFilter?: number;
  filter: string;
};
