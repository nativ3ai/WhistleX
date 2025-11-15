import { createAuthManager, storagePlugins } from "@lit-protocol/auth";

export const authManager = createAuthManager({
  storage: storagePlugins.localStorage({
    appName: "intel-marketplace",
    networkName: process.env.NEXT_PUBLIC_LIT_NETWORK ?? "naga-dev"
  })
});
