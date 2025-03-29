import React from "react";

interface TextOptions {
  text: string;
  posX: number;
  posY: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily: string;
  fontStyle: string;
}

interface TextControlProps {
  textOptions: TextOptions;
  onTextOptionsChange: (options: TextOptions) => void;
}

export function TextControl({ textOptions, onTextOptionsChange }: TextControlProps) {
  const handleChange = (field: keyof TextOptions, value: any) => {
    onTextOptionsChange({
      ...textOptions,
      [field]: value
    });
  };
  
  const fontFamilies = ["sans-serif", "serif", "monospace", "cursive", "fantasy"];
  const fontWeights = ["normal", "bold", "lighter", "bolder"];
  const fontStyles = ["normal", "italic"];
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 space-y-4">
      <h3 className="font-medium text-lg mb-2">テキスト設定</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">テキスト</label>
        <input
          type="text"
          value={textOptions.text}
          onChange={(e) => handleChange("text", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">色</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={textOptions.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-10 h-10 rounded-md overflow-hidden cursor-pointer"
          />
          <input
            type="text"
            value={textOptions.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">フォントサイズ ({textOptions.fontSize}px)</label>
        <input
          type="range"
          min="10"
          max="120"
          value={textOptions.fontSize}
          onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">フォントファミリー</label>
        <select
          value={textOptions.fontFamily}
          onChange={(e) => handleChange("fontFamily", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
        >
          {fontFamilies.map((family) => (
            <option key={family} value={family}>
              {family.charAt(0).toUpperCase() + family.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">フォントウェイト</label>
        <select
          value={textOptions.fontWeight}
          onChange={(e) => handleChange("fontWeight", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
        >
          {fontWeights.map((weight) => (
            <option key={weight} value={weight}>
              {weight.charAt(0).toUpperCase() + weight.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">フォントスタイル</label>
        <select
          value={textOptions.fontStyle}
          onChange={(e) => handleChange("fontStyle", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
        >
          {fontStyles.map((style) => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">X位置 ({textOptions.posX}%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={textOptions.posX}
            onChange={(e) => handleChange("posX", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Y位置 ({textOptions.posY}%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={textOptions.posY}
            onChange={(e) => handleChange("posY", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
