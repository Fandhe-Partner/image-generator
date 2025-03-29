import { useRef, useState } from "react";
import type { Route } from "./+types/lgtm";

import "@pqina/pintura/pintura.css";
import { PinturaEditor } from "@pqina/react-pintura";

import {
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_finetune,
  plugin_finetune_locale_en_gb,
  plugin_finetune_defaults,
  plugin_filter,
  plugin_filter_locale_en_gb,
  plugin_filter_defaults,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
} from "@pqina/pintura";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorConfig = {
  locale: locale_en_gb,
  imageReader: createDefaultImageReader(),
  imageWriter: createDefaultImageWriter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  ...plugin_finetune_defaults,
  ...plugin_filter_defaults,
  ...markup_editor_defaults,
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LGTM Image Editor" },
    { name: "description", content: "Create customized LGTM images" },
  ];
}

export default function LgtmEditor() {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const editorRef = useRef(null);

  return (
    <main className="flex flex-col items-center p-4 w-full min-h-screen">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">LGTM Image Editor</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-2 mb-4">
          <div className="w-full h-[600px]">
            <PinturaEditor
              ref={editorRef}
              className="h-full"
              {...editorConfig}
              utils={["crop", "filter", "finetune", "annotate"]}
              layoutDirectionPreference="vertical"
              imageCropAspectRatio={1}
              onProcess={(res: any) => {
                console.log('Image processed', res);
                if (res.dest) {
                  const url = URL.createObjectURL(res.dest);
                  setResultUrl(url);
                }
              }}
            />
          </div>
        </div>
        
        {resultUrl && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Result</h2>
            <img src={resultUrl} alt="Processed image" className="max-w-full rounded-lg" />
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-500">
            Edit your image, then export to create your LGTM image
          </p>
        </div>
      </div>
    </main>
  );
}
