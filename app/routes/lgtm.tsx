import React from "react";
import { ImageEditor } from "../features/image-editor/ImageEditor";
import type { Route } from "./+types/lgtm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LGTM Image Generator" },
    { name: "description", content: "Create and customize LGTM images" },
  ];
}

export default function LGTM() {
  return <ImageEditor />;
}
