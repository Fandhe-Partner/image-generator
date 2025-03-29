import React, { useState, useRef } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { TextControl } from "./components/TextControl";
import { ImageAdjuster } from "./components/ImageAdjuster";
import { BackgroundControl } from "./components/BackgroundControl";
import { DownloadControl } from "./components/DownloadControl";
import { useImageGenerator } from "./hooks/useImageGenerator";

export function ImageEditor() {
  const {
    imageFile,
    previewUrl,
    resultUrl,
    textOptions,
    imageOptions,
    backgroundColor,
    setImageFile,
    setTextOptions,
    setImageOptions,
    setBackgroundColor,
    generateImage,
    downloadImage,
  } = useImageGenerator();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!previewUrl) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imageOptions.posX,
      y: e.clientY - imageOptions.posY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setImageOptions({
      ...imageOptions,
      posX: e.clientX - dragStart.x,
      posY: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-8">LGTM Image Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {!previewUrl ? (
            <ImageUploader onFileChange={setImageFile} />
          ) : (
            <div className="space-y-4">
              <div 
                className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                <div 
                  className="w-full aspect-auto flex items-center justify-center" 
                  style={{ backgroundColor }}
                >
                  <img 
                    ref={imageRef}
                    src={resultUrl || previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain"
                    style={{
                      clipPath: imageOptions.clipRatio !== 'none' 
                        ? `inset(${imageOptions.clipY}px ${imageOptions.clipX}px ${imageOptions.clipY}px ${imageOptions.clipX}px)`
                        : 'none',
                      transform: `translate(${imageOptions.posX}px, ${imageOptions.posY}px)`
                    }}
                  />
                  {previewUrl && !resultUrl && (
                    <div 
                      className="absolute pointer-events-none" 
                      style={{
                        top: `${textOptions.posY}%`, 
                        left: `${textOptions.posX}%`, 
                        transform: 'translate(-50%, -50%)',
                        color: textOptions.color,
                        fontSize: `${textOptions.fontSize}px`,
                        fontWeight: textOptions.fontWeight,
                        fontFamily: textOptions.fontFamily,
                        fontStyle: textOptions.fontStyle,
                      }}
                    >
                      {textOptions.text}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => {
                    setImageFile(null);
                    setTextOptions({
                      text: "LGTM",
                      posX: 50,
                      posY: 50,
                      fontSize: 48,
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      fontStyle: "normal"
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Reset
                </button>
                <button 
                  onClick={generateImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Generate
                </button>
              </div>
              
              {resultUrl && (
                <DownloadControl onDownload={downloadImage} />
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {previewUrl && (
            <>
              <TextControl textOptions={textOptions} onTextOptionsChange={setTextOptions} />
              <ImageAdjuster imageOptions={imageOptions} onImageOptionsChange={setImageOptions} />
              <BackgroundControl 
                backgroundColor={backgroundColor} 
                onBackgroundColorChange={setBackgroundColor} 
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
