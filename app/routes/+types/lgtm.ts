import type { ReactNode } from "react";

export namespace Route {
  export type LoaderFunctionArgs = {
    request: Request;
    params: Record<string, string>;
    context: unknown;
  };
  export type Loader = Awaited<ReturnType<LoaderFunction>>;
  export type LoaderFunction = (
    args: LoaderFunctionArgs
  ) => Promise<Record<string, unknown>>;
  export type MetaArgs = {
    data: Record<string, unknown>;
    params: Record<string, string>;
    location: { pathname: string; search: string; hash: string };
  };
  export type MetaDescriptor = {
    charSet?: string;
    title?: string;
    name?: string;
    content?: string;
    property?: string;
    httpEquiv?: string;
    media?: string;
    [key: string]: string | undefined;
  };
  export type MetaFunction = (args: MetaArgs) => MetaDescriptor[];
  export type ActionFunction = (
    args: LoaderFunctionArgs
  ) => Promise<Response | void>;
  export type ErrorBoundaryProps = {
    error: Error;
    children?: ReactNode;
  };
}
