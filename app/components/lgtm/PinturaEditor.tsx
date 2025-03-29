import React, { useEffect, useState, useRef } from "react";
import type { ImageSource } from "./LgtmEditor";

interface PinturaEditorProps {
  imageSource: ImageSource;
  onImageEdit: (blob: Blob) => void;
  onBack: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function PinturaEditor({
  imageSource,
  onImageEdit,
  onBack,
}: PinturaEditorProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [editMode, setEditMode] = useState<"crop" | "rotate" | "filter" | "text" | null>(null);
  const [textInput, setTextInput] = useState("LGTM");
  const [textSize, setTextSize] = useState(48);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textStroke, setTextStroke] = useState("#000000");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    if (imageSource.type === "file") {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(imageSource.data as File);
    } else {
      setSrc(imageSource.data as string);
    }
  }, [imageSource]);
  
  useEffect(() => {
    if (src) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const cnv = canvasRef.current;
          cnv.width = img.width;
          cnv.height = img.height;
          const ctx = cnv.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setImageElement(img);
          }
        }
      };
      img.src = src;
    }
  }, [src]);
  
  useEffect(() => {
    if (editMode === "crop" && canvasRef.current && cropCanvasRef.current) {
      cropCanvasRef.current.width = canvasRef.current.width;
      cropCanvasRef.current.height = canvasRef.current.height;
      
      setCropStart(null);
      setCropEnd(null);
      setCropArea(null);
    }
  }, [editMode]);
  
  const applyFilter = (filterName: string | null) => {
    if (!canvasRef.current || !imageElement) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(imageElement, 0, 0);
    
    if (!filterName) return;
    
    switch (filterName) {
      case "grayscale":
        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
        break;
      case "sepia":
        const sepiaData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const sepiaPixels = sepiaData.data;
        for (let i = 0; i < sepiaPixels.length; i += 4) {
          const r = sepiaPixels[i];
          const g = sepiaPixels[i + 1];
          const b = sepiaPixels[i + 2];
          sepiaPixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          sepiaPixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          sepiaPixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        ctx.putImageData(sepiaData, 0, 0);
        break;
      case "invert":
        const invertData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const invertPixels = invertData.data;
        for (let i = 0; i < invertPixels.length; i += 4) {
          invertPixels[i] = 255 - invertPixels[i];
          invertPixels[i + 1] = 255 - invertPixels[i + 1];
          invertPixels[i + 2] = 255 - invertPixels[i + 2];
        }
        ctx.putImageData(invertData, 0, 0);
        break;
    }
  };
  
  const applyRotation = (degrees: number) => {
    if (!canvasRef.current || !imageElement) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    const originalWidth = canvasRef.current.width;
    const originalHeight = canvasRef.current.height;
    
    ctx.clearRect(0, 0, originalWidth, originalHeight);
    ctx.save();
    ctx.translate(originalWidth / 2, originalHeight / 2);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(imageElement, -imageElement.width / 2, -imageElement.height / 2);
    ctx.restore();
  };
  
  const addText = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.font = `${textSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = textStroke;
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const x = (canvasRef.current.width * textPosition.x) / 100;
    const y = (canvasRef.current.height * textPosition.y) / 100;
    
    ctx.strokeText(textInput, x, y);
    ctx.fillText(textInput, x, y);
  };
  
  const applyCrop = () => {
    if (!canvasRef.current || !cropArea || cropArea.width < 10 || cropArea.height < 10) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = cropArea.width;
    tempCanvas.height = cropArea.height;
    const tempCtx = tempCanvas.getContext("2d");
    
    if (!tempCtx) return;
    
    tempCtx.drawImage(
      canvasRef.current,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );
    
    canvasRef.current.width = cropArea.width;
    canvasRef.current.height = cropArea.height;
    
    ctx.drawImage(tempCanvas, 0, 0);
    
    setCropStart(null);
    setCropEnd(null);
    setCropArea(null);
    setEditMode(null);
  };
  
  const handleCropMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropCanvasRef.current) return;
    
    const rect = cropCanvasRef.current.getBoundingClientRect();
    const scaleX = cropCanvasRef.current.width / rect.width;
    const scaleY = cropCanvasRef.current.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    setCropStart({ x, y });
    setCropEnd({ x, y });
    setIsDragging(true);
  };
  
  const handleCropMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !cropCanvasRef.current || !cropStart) return;
    
    const rect = cropCanvasRef.current.getBoundingClientRect();
    const scaleX = cropCanvasRef.current.width / rect.width;
    const scaleY = cropCanvasRef.current.height / rect.height;
    
    const x = Math.max(0, Math.min((e.clientX - rect.left) * scaleX, cropCanvasRef.current.width));
    const y = Math.max(0, Math.min((e.clientY - rect.top) * scaleY, cropCanvasRef.current.height));
    
    setCropEnd({ x, y });
    
    const cropX = Math.min(cropStart.x, x);
    const cropY = Math.min(cropStart.y, y);
    const cropWidth = Math.abs(x - cropStart.x);
    const cropHeight = Math.abs(y - cropStart.y);
    
    setCropArea({ x: cropX, y: cropY, width: cropWidth, height: cropHeight });
    
    drawCropOverlay();
  };
  
  const handleCropMouseUp = () => {
    setIsDragging(false);
  };
  
  const drawCropOverlay = () => {
    if (!cropCanvasRef.current || !cropArea) return;
    
    const ctx = cropCanvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, cropCanvasRef.current.width, cropCanvasRef.current.height);
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, cropCanvasRef.current.width, cropCanvasRef.current.height);
    
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
  };
  
  const processImage = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onImageEdit(blob);
      }
    });
  };
  
  const resetImage = () => {
    if (!canvasRef.current || !imageElement) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    canvasRef.current.width = imageElement.width;
    canvasRef.current.height = imageElement.height;
    
    setRotation(0);
    setFilter(null);
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(imageElement, 0, 0);
  };
  
  if (!src) return null;
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          onClick={onBack}
        >
          戻る
        </button>
        <h2 className="text-xl font-semibold">画像を編集</h2>
        <div className="w-24"></div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar tools - Pintura style */}
        <div className="w-full md:w-16 bg-gray-50 border-r border-gray-200 flex flex-row md:flex-col">
          <button
            type="button"
            className={`flex flex-col items-center justify-center p-3 w-full hover:bg-gray-100 transition-colors ${
              editMode === "crop" ? "bg-blue-50 text-blue-600" : ""
            }`}
            onClick={() => setEditMode(editMode === "crop" ? null : "crop")}
            title="クロップ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-xs mt-1">クロップ</span>
          </button>
          <button
            type="button"
            className={`flex flex-col items-center justify-center p-3 w-full hover:bg-gray-100 transition-colors ${
              editMode === "rotate" ? "bg-blue-50 text-blue-600" : ""
            }`}
            onClick={() => setEditMode(editMode === "rotate" ? null : "rotate")}
            title="回転"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs mt-1">回転</span>
          </button>
          <button
            type="button"
            className={`flex flex-col items-center justify-center p-3 w-full hover:bg-gray-100 transition-colors ${
              editMode === "filter" ? "bg-blue-50 text-blue-600" : ""
            }`}
            onClick={() => setEditMode(editMode === "filter" ? null : "filter")}
            title="フィルター"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs mt-1">フィルター</span>
          </button>
          <button
            type="button"
            className={`flex flex-col items-center justify-center p-3 w-full hover:bg-gray-100 transition-colors ${
              editMode === "text" ? "bg-blue-50 text-blue-600" : ""
            }`}
            onClick={() => setEditMode(editMode === "text" ? null : "text")}
            title="テキスト"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs mt-1">テキスト</span>
          </button>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Image preview */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="relative max-w-full max-h-[70vh] overflow-hidden bg-[#f0f0f0] rounded shadow-inner">
              <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-full object-contain"
              />
              {editMode === "crop" && (
                <canvas
                  ref={cropCanvasRef}
                  className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                  onMouseDown={handleCropMouseDown}
                  onMouseMove={handleCropMouseMove}
                  onMouseUp={handleCropMouseUp}
                  onMouseLeave={handleCropMouseUp}
                />
              )}
            </div>
          </div>
          
          {/* Tool options panel */}
          <div className="w-full md:w-72 p-4 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50 flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wider">
                {editMode === "crop" ? "クロップ" : 
                 editMode === "rotate" ? "回転" : 
                 editMode === "filter" ? "フィルター" : 
                 editMode === "text" ? "テキスト" : "編集ツール"}
              </h3>
            </div>
          
            {/* Tool options */}
            {editMode === "crop" && (
              <div className="flex flex-col space-y-2 p-2 border border-gray-200 rounded">
                <h4 className="text-sm font-medium">クロップ</h4>
                <p className="text-sm text-gray-600">画像上でドラッグして範囲を選択</p>
                <div className="relative">
                  {cropArea && (
                    <div className="flex justify-between mt-2">
                      <span className="text-xs">
                        {Math.round(cropArea.width)} x {Math.round(cropArea.height)}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="mt-2 px-2 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
                    onClick={() => cropArea && applyCrop()}
                    disabled={!cropArea || cropArea.width < 10 || cropArea.height < 10}
                  >
                    クロップを適用
                  </button>
                </div>
              </div>
            )}
            
            {editMode === "rotate" && (
              <div className="flex flex-col space-y-2 p-2 border border-gray-200 rounded">
                <h4 className="text-sm font-medium">回転</h4>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => {
                      const newRotation = rotation - 90;
                      setRotation(newRotation);
                      applyRotation(newRotation);
                    }}
                  >
                    -90°
                  </button>
                  <span>{rotation}°</span>
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => {
                      const newRotation = rotation + 90;
                      setRotation(newRotation);
                      applyRotation(newRotation);
                    }}
                  >
                    +90°
                  </button>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => {
                      const newRotation = rotation - 15;
                      setRotation(newRotation);
                      applyRotation(newRotation);
                    }}
                  >
                    -15°
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => {
                      const newRotation = rotation + 15;
                      setRotation(newRotation);
                      applyRotation(newRotation);
                    }}
                  >
                    +15°
                  </button>
                </div>
              </div>
            )}
            
            {editMode === "filter" && (
              <div className="flex flex-col space-y-2 p-2 border border-gray-200 rounded">
                <h4 className="text-sm font-medium">フィルター</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`px-2 py-1 rounded ${
                      filter === null ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => {
                      setFilter(null);
                      applyFilter(null);
                    }}
                  >
                    なし
                  </button>
                  <button
                    type="button"
                    className={`px-2 py-1 rounded ${
                      filter === "grayscale" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => {
                      setFilter("grayscale");
                      applyFilter("grayscale");
                    }}
                  >
                    グレースケール
                  </button>
                  <button
                    type="button"
                    className={`px-2 py-1 rounded ${
                      filter === "sepia" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => {
                      setFilter("sepia");
                      applyFilter("sepia");
                    }}
                  >
                    セピア
                  </button>
                  <button
                    type="button"
                    className={`px-2 py-1 rounded ${
                      filter === "invert" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => {
                      setFilter("invert");
                      applyFilter("invert");
                    }}
                  >
                    反転
                  </button>
                </div>
              </div>
            )}
            
            {editMode === "text" && (
              <div className="flex flex-col space-y-2 p-2 border border-gray-200 rounded">
                <h4 className="text-sm font-medium">テキスト</h4>
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded"
                    placeholder="テキストを入力"
                  />
                  <div className="flex justify-between items-center">
                    <label className="text-xs">サイズ:</label>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={textSize}
                      onChange={(e) => setTextSize(parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-xs">{textSize}px</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs">色:</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8"
                    />
                    <label className="text-xs">縁取り:</label>
                    <input
                      type="color"
                      value={textStroke}
                      onChange={(e) => setTextStroke(e.target.value)}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs">位置:</label>
                    <div className="flex space-x-2">
                      <div className="flex flex-col space-y-1">
                        <label className="text-xs">X:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={textPosition.x}
                          onChange={(e) => setTextPosition({ ...textPosition, x: parseInt(e.target.value) })}
                          className="w-24"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-xs">Y:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={textPosition.y}
                          onChange={(e) => setTextPosition({ ...textPosition, y: parseInt(e.target.value) })}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                    onClick={addText}
                  >
                    テキストを追加
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col space-y-2 mt-4">
              <button
                type="button"
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                onClick={resetImage}
              >
                リセット
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                onClick={processImage}
              >
                編集完了
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
