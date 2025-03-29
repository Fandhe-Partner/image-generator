import React, { useEffect, useState } from "react";
import type { ImageSource } from "./LgtmEditor";

interface PinturaEditorComponentProps {
  imageSource: ImageSource;
  onImageEdit: (blob: Blob) => void;
  onBack: () => void;
}

export function PinturaEditor({
  imageSource,
  onImageEdit,
  onBack,
}: PinturaEditorComponentProps) {
  const [src, setSrc] = useState<string | null>(null);
  
  useEffect(() => {
    if (imageSource.type === "file") {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setSrc(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(imageSource.data as File);
    } else {
      setSrc(imageSource.data as string);
    }
  }, [imageSource]);
  
  const handleEdit = () => {
    if (src) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            onImageEdit(blob);
          }
        }, 'image/png');
      };
      
      img.src = src;
    }
  };
  
  if (!src) return null;
  
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
        <div className="border border-gray-200 rounded-lg p-4 max-w-2xl">
          <img
            src={src}
            alt="Preview"
            className="max-w-full h-auto"
          />
        </div>
        
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleEdit}
        >
          編集完了
        </button>
      </div>
    </div>
  );
}
