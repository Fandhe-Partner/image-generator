import React, { useRef } from "react";

interface BackgroundControlProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

export function BackgroundControl({ 
  backgroundColor, 
  onBackgroundColorChange 
}: BackgroundControlProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  const presetColors = [
    "#FFFFFF", // white
    "#F8F9FA", // light gray
    "#000000", // black
    "#212529", // dark gray
    "#FFC107", // yellow
    "#28A745", // green
    "#DC3545", // red
    "#007BFF", // blue
    "#6F42C1", // purple
    "#FD7E14", // orange
    "#20C997", // teal
    "#E83E8C", // pink
  ];
  
  const handlePresetClick = (color: string) => {
    onBackgroundColorChange(color);
    if (colorInputRef.current) {
      colorInputRef.current.value = color;
    }
  };
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 space-y-4">
      <h3 className="font-medium text-lg mb-2">背景色</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">カラー</label>
        <div className="flex items-center space-x-2">
          <input
            ref={colorInputRef}
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="w-10 h-10 rounded-md overflow-hidden cursor-pointer"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => {
              onBackgroundColorChange(e.target.value);
              if (colorInputRef.current) {
                colorInputRef.current.value = e.target.value;
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">プリセット</label>
        <div className="grid grid-cols-6 gap-2 mt-1">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => handlePresetClick(color)}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: color }}
              aria-label={`Color: ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
