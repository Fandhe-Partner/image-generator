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
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image preview */}
        <div className="flex-1 flex flex-col items-center">
          <div className="border border-gray-200 rounded-lg p-2 max-w-full overflow-hidden relative">
            <canvas 
              ref={canvasRef} 
              className="max-w-full h-auto"
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
        
        {/* Edit tools */}
        <div className="w-full md:w-64 flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">編集ツール</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  editMode === "crop" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setEditMode(editMode === "crop" ? null : "crop")}
              >
                クロップ
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  editMode === "rotate" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setEditMode(editMode === "rotate" ? null : "rotate")}
              >
                回転
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  editMode === "filter" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setEditMode(editMode === "filter" ? null : "filter")}
              >
                フィルター
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  editMode === "text" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setEditMode(editMode === "text" ? null : "text")}
              >
                テキスト
              </button>
            </div>
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
          
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={resetImage}
            >
              リセット
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={processImage}
            >
              編集完了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
