import { btc, cad, usd } from "$lib/utils";

export const outer = (a) =>
  ({
    [btc]: "bg-yellow-400",
    [cad]: "bg-red-600",
    [usd]: "bg-lightblue",
  }[a] || "bg-white");

export const border = (a) =>
  ({
    [btc]: "border-yellow-400",
    [cad]: "border-red-600",
    [usd]: "border-blue",
  }[a] || "border-white");

export const bg = (a) =>
  ({
    [btc]: "dark-yellow",
    [cad]: "dark-red",
    [usd]: "dark-green",
  }[a] || "dark-gray");
