// Temporary production check for splash page deployment

import type { AppLoadContext } from "@shopify/remix-oxygen";

export function showAllTheMagic(context: AppLoadContext) {
  // @ts-expect-error -- this will go away eventually
  const magic = String(context.env.SHOW_ALL_THE_MAGIC);

  return magic === "true";
}
