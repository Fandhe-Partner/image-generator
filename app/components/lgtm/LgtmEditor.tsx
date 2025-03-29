import React, { useState, useRef } from "react";
import { ImageUploader } from "./ImageUploader";
import { PinturaEditor } from "./PinturaEditor";
import { getFormattedDate } from "../../utils/date";

export type ImageSource = {
  type: "file" | "url";
  data: File | string;
};

export function LgtmEditor() {
  const [imageSource, setImageSource] = useState<ImageSource | null>(null);
  const [editedImage, setEditedImage] = useState<Blob | null>(null);
  const [imageFormat, setImageFormat] = useState<"png" | "jpg">("png");
  
  const handleImageSelect = (source: ImageSource) => {
    setImageSource(source);
    setEditedImage(null);
  };
  
  const handleImageEdit = (blob: Blob) => {
    setEditedImage(blob);
  };
  
  const handleDownload = () => {
    if (!editedImage) return;
    
    const date = getFormattedDate();
    const fileName = `${date}-lgtm.${imageFormat}`;
    const url = URL.createObjectURL(editedImage);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleFormatChange = (format: "png" | "jpg") => {
    setImageFormat(format);
  };
  
  return (
    <div className="flex flex-col space-y-6">
      {!imageSource ? (
        <ImageUploader onImageSelect={handleImageSelect} />
      ) : !editedImage ? (
        <PinturaEditor
          imageSource={imageSource}
          onImageEdit={handleImageEdit}
          onBack={() => setImageSource(null)}
        />
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 max-w-2xl">
            <img
              src={URL.createObjectURL(editedImage)}
              alt="Edited"
              className="max-w-full h-auto"
            />
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="flex space-x-2">
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  imageFormat === "png" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => handleFormatChange("png")}
              >
                PNG
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  imageFormat === "jpg" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => handleFormatChange("jpg")}
              >
                JPG
              </button>
            </div>
            
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleDownload}
            >
              ダウンロード
            </button>
            
            <button
              type="button"
              className="border border-gray-300 px-4 py-2 rounded"
              onClick={() => setEditedImage(null)}
            >
              編集に戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
