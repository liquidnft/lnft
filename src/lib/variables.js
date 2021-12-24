export const variables = {
  publicWs: import.meta.env.VITE_PUBLIC_WS,
  publicHttp: import.meta.env.VITE_PUBLIC_HTTP,
  publicExplorer: import.meta.env.VITE_PUBLIC_EXPLORER,
  publicCad: import.meta.env.VITE_PUBLIC_CAD,
  publicUsd: import.meta.env.VITE_PUBLIC_USD,
  publicBtc: import.meta.env.VITE_PUBLIC_BTC,
  publicNetwork: import.meta.env.VITE_PUBLIC_NETWORK || "liquid",
};
