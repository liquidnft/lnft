import { btc, cad, usd } from "$lib/utils";

export const outer = (a) =>
  ({
    [btc]: "outer-btc",
    [cad]: "bg-red-600",
    [usd]: "bg-lightblue",
  }[a] || "bg-white");

export const border = (a) =>
  ({
    [btc]: "border-btc",
    [cad]: "border-red-600",
    [usd]: "border-blue",
  }[a] || "border-white");

export const bg = (a) =>
  ({
    [btc]: "bg-btc",
    [cad]: "dark-red",
    [usd]: "dark-green",
  }[a] || "dark-gray");
