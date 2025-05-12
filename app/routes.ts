import { flatRoutes } from "@remix-run/fs-routes";
import { hydrogenRoutes } from "@shopify/hydrogen";
import { prefix, route, type RouteConfig } from "@remix-run/route-config";

const routes = [
  ...(await hydrogenRoutes(
    await flatRoutes({ rootDirectory: "routes/pages" }),
  )),
  ...prefix("_resources", [
    route("load-more-products", "routes/resources/load-more-products.tsx"),
  ]),
] satisfies RouteConfig;

export default routes;
