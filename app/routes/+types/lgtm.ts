import type { ActionFunctionArgs, MetaFunction } from "react-router";

export namespace Route {
  export type MetaArgs = Record<string, unknown>;
  export type Meta = MetaFunction;
  export type ActionArgs = ActionFunctionArgs;
}
