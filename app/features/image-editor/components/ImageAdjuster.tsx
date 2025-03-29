import React, { useRef } from "react";

interface ImageOptions {
  clipRatio: string;
  clipX: number;
  clipY: number;
  posX: number;
  posY: number;
}

interface ImageAdjusterProps {
  imageOptions: ImageOptions;
  onImageOptionsChange: (options: ImageOptions) => void;
}

export function ImageAdjuster({ imageOptions, onImageOptionsChange }: ImageAdjusterProps) {
  const clipXRef = useRef<HTMLInputElement>(null);
  const clipYRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (field: keyof ImageOptions, value: any) => {
    onImageOptionsChange({
      ...imageOptions,
      [field]: value
    });
  };
  
  const setClipRatio = (ratio: string) => {
    onImageOptionsChange({
      ...imageOptions,
      clipRatio: ratio
    });
    
    if (ratio !== "none" && clipXRef.current && clipYRef.current) {
      const [width, height] = ratio.split('/').map(Number);
      clipXRef.current.value = String(Math.round(100 * (1 - width / height) / 2));
      clipYRef.current.value = String(Math.round(100 * (1 - height / width) / 2));
      
      onImageOptionsChange({
        ...imageOptions,
        clipRatio: ratio,
        clipX: Math.round(100 * (1 - width / height) / 2),
        clipY: Math.round(100 * (1 - height / width) / 2)
      });
    }
  };
  
  const clipRatios = [
    { label: "16:9", value: "16/9" },
    { label: "4:3", value: "4/3" },
    { label: "1:1", value: "1/1" },
    { label: "3:4", value: "3/4" },
    { label: "9:16", value: "9/16" }
  ];
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 space-y-4">
      <h3 className="font-medium text-lg mb-2">画像調整</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">クリップX ({imageOptions.clipX}px)</label>
        <input
          ref={clipXRef}
          type="number"
          min="0"
          max="100"
          value={imageOptions.clipX}
          onChange={(e) => handleChange("clipX", parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">クリップY ({imageOptions.clipY}px)</label>
        <input
          ref={clipYRef}
          type="number"
          min="0"
          max="100"
          value={imageOptions.clipY}
          onChange={(e) => handleChange("clipY", parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">比率プリセット</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {clipRatios.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => setClipRatio(ratio.value)}
              className={`px-2 py-1 rounded text-sm ${
                imageOptions.clipRatio === ratio.value
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {ratio.label}
            </button>
          ))}
          <button
            onClick={() => {
              setClipRatio("none");
              if (clipXRef.current && clipYRef.current) {
                clipXRef.current.value = "0";
                clipYRef.current.value = "0";
              }
            }}
            className={`px-2 py-1 rounded text-sm ${
              imageOptions.clipRatio === "none"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            None
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">画像をドラッグして移動できます</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">X位置 ({imageOptions.posX}px)</label>
            <input
              type="number"
              value={imageOptions.posX}
              onChange={(e) => handleChange("posX", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y位置 ({imageOptions.posY}px)</label>
            <input
              type="number"
              value={imageOptions.posY}
              onChange={(e) => handleChange("posY", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
