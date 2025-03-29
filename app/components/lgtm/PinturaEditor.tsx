import React, { useEffect, useState } from "react";
import type { ImageSource } from "./LgtmEditor";
import { PinturaEditor as PinturaEditorComponent } from "@pqina/react-pintura";
import "@pqina/pintura/pintura.css";

import {
  // Core
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  
  // Plugins
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_finetune,
  plugin_finetune_locale_en_gb,
  plugin_filter,
  plugin_filter_locale_en_gb,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
} from "@pqina/pintura";

// Configure plugins
setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

interface PinturaEditorProps {
  imageSource: ImageSource;
  onImageEdit: (blob: Blob) => void;
  onBack: () => void;
}

export function PinturaEditor({
  imageSource,
  onImageEdit,
  onBack,
}: PinturaEditorProps) {
  const [src, setSrc] = useState<string | File | null>(null);
  
  useEffect(() => {
    if (imageSource.type === "file") {
      setSrc(imageSource.data as File);
    } else {
      setSrc(imageSource.data as string);
    }
  }, [imageSource]);
  
  if (!src) return null;
  
  // Configure editor with all required features
  const editorConfig = {
    // Core configuration
    locale: {
      ...locale_en_gb,
      // Override with Japanese labels for key actions
      labelButtonCancel: "キャンセル",
      labelButtonConfirm: "確認",
      labelStatusAwaitingImage: "画像を待っています",
      labelStatusLoadingImage: "画像を読み込んでいます",
    },
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    
    // UI configuration
    enableButtonExport: false,
    enableNavigateHistory: true,
    enableToolbar: true,
    enableUtils: true,
    enableZoom: true,
    
    // Crop feature
    enableCrop: true,
    cropEnableImageSelection: true,
    cropEnableInfoIndicator: true,
    cropEnableZoomTowardsWheelPosition: true,
    cropEnableRotationInput: true,
    cropEnableButtonRotateLeft: true,
    cropEnableButtonRotateRight: true,
    cropEnableButtonFlipHorizontal: true,
    cropEnableButtonFlipVertical: true,
    cropImageSelectionCornerStyle: "round",
    
    // Finetune feature
    enableFinetune: true,
    finetuneControlExposure: true,
    finetuneControlBrightness: true,
    finetuneControlContrast: true,
    finetuneControlSaturation: true,
    finetuneControlTemperature: true,
    finetuneControlGamma: true,
    finetuneControlClarity: true,
    finetuneControlVignette: true,
    
    // Filter feature
    enableFilters: true,
    
    // Annotate feature
    enableAnnotate: true,
    annotateEnableSelectImageMarker: true,
    markupEditorShapeStyleControls: true,
    markupEditorToolSelectRadius: 10,
    markupEditorToolStyles: {
      text: {
        fontSize: "2em",
        fontFamily: "sans-serif",
        color: [1, 1, 1],
        backgroundColor: [0, 0, 0, 0.5],
      },
    },
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded"
          onClick={onBack}
        >
          戻る
        </button>
        <h2 className="text-xl font-semibold">画像を編集</h2>
        <div className="w-24"></div>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-4xl h-[600px]">
          <PinturaEditorComponent
            {...editorConfig}
            src={src}
            onProcess={({ dest }) => {
              if (dest) {
                onImageEdit(dest);
              }
            }}
          />
        </div>
        
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            const editor = document.querySelector('.PinturaRoot');
            if (editor) {
              const confirmButton = editor.querySelector('[data-action="confirm"]');
              if (confirmButton) {
                (confirmButton as HTMLElement).click();
              }
            }
          }}
        >
          編集完了
        </button>
      </div>
    </div>
  );
}
