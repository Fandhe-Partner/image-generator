import { useState } from "react";
import type { Route } from "../+types/lgtm";
import { LgtmEditor } from "../components/lgtm/LgtmEditor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LGTM Image Editor" },
    { name: "description", content: "Edit and download LGTM images" },
  ];
}

export default function Lgtm() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">LGTM Image Editor</h1>
      <LgtmEditor />
    </div>
  );
}
