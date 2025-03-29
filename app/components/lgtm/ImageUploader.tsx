import React, { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import type { ImageSource } from "./LgtmEditor";

interface ImageUploaderProps {
  onImageSelect: (source: ImageSource) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onImageSelect({ type: "file", data: file });
      }
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect({ type: "file", data: e.target.files[0] });
    }
  };
  
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageSelect({ type: "url", data: urlInput.trim() });
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4 mb-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-t-lg ${
            inputMethod === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setInputMethod("upload")}
        >
          画像をアップロード
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-t-lg ${
            inputMethod === "url" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setInputMethod("url")}
        >
          URLから画像を取得
        </button>
      </div>
      
      {inputMethod === "upload" ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg">ドラッグ＆ドロップまたはクリックして画像を選択</p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF 対応</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              取得
            </button>
          </div>
          <p className="text-sm text-gray-500">画像のURLを入力してください</p>
        </div>
      )}
    </div>
  );
}
