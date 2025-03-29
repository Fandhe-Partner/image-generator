import React, { useState } from "react";

interface DownloadControlProps {
  onDownload: (format: "png" | "jpg") => void;
}

export function DownloadControl({ onDownload }: DownloadControlProps) {
  const [format, setFormat] = useState<"png" | "jpg">("png");
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 space-y-4">
      <h3 className="font-medium text-lg mb-2">ダウンロード</h3>
      
      <div className="flex items-center space-x-4 mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="format"
            value="png"
            checked={format === "png"}
            onChange={() => setFormat("png")}
          />
          <span className="ml-2">PNG</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="format"
            value="jpg"
            checked={format === "jpg"}
            onChange={() => setFormat("jpg")}
          />
          <span className="ml-2">JPG</span>
        </label>
      </div>
      
      <button
        onClick={() => onDownload(format)}
        className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        ダウンロード ({format.toUpperCase()})
      </button>
    </div>
  );
}
