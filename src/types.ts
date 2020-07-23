import { Game, Modlist } from "@modwatch/types";

export type PartialModlist = Modlist & {
  username: string;
  game: Game;
  timestamp: Date;
  score?: number;
};
