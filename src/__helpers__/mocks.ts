import { Modlist } from "@modwatch/types";

export const modlists: Partial<Modlist>[] = [
  {
    username: "Peanut",
    game: "skyrim",
    timestamp: new Date("1/1/2019")
  },
  {
    username: "Thallasa",
    game: "fallout4",
    timestamp: new Date("2/1/2019")
  },
  {
    username: "Trainwiz",
    game: "skyrimse",
    timestamp: new Date("2/2/2019")
  }
];

export const modlist = {
  ...modlists[0],
  plugins: [
    "Unofficial Skyrim Special Edition Patch.esp",
    "RSkyrimChildren.esm",
    "ETaC - RESOURCES.esm",
    "Skyrim Project Optimization - Full Version.esm",
    "ApachiiHair.esm",
    "Alpine Forest of Whiterun Valley.esp",
    "SGEyebrows.esp",
    "UHDAP - MusicHQ.esp",
    "FISS.esp",
    "MajesticMountains_Landscape.esm",
    "CreationClub.esl"
  ],
  modlist: [
    "+Optimized HearthFires Textures - SD",
    "+Optimized Dragonborn Textures - SD",
    "+Optimized Dawnguard Textures - SD",
    "+Optimized Vanilla Textures - SD",
    "-Crash fixes",
    "+skse 1 07 03",
    "+NobleSkyrimMod HD-2K",
    "+Enhanced Vanilla Trees",
    "+Better Dialogue Controls",
    "-Natural Lighting Vivid Atmospherics"
  ],
  ini: [
    "[Actor]",
    "bUseNavMeshForMovement=0",
    "[Animation]",
    "fMaxFrameCounterDifferenceToConsiderVisible=0.06666667",
    "[Archive]",
    "bLoadArchiveInMemory=1",
    "sArchiveToLoadInMemoryList=Skyrim - Animations.bsa"
  ],
  prefsini: [
    "[AudioMenu]",
    "fAudioMasterVolume=1.0000",
    "fVal0=1.0000",
    "fVal1=0.1500",
    "fVal2=0.8000",
    "fVal3=0.5000",
    "fVal4=0.2000",
    "fVal5=1.0000",
    "fVal6=0.7500",
    "fVal7=0.5500"
  ],
  files: ["plugins", "modlist", "ini", "prefsini"]
};
