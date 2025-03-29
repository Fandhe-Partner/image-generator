import { useState, useEffect, useRef } from "react";

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

interface ImageOptions {
  clipRatio: string;
  clipX: number;
  clipY: number;
  posX: number;
  posY: number;
}

export function useImageGenerator() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  
  const [textOptions, setTextOptions] = useState<TextOptions>({
    text: "LGTM",
    posX: 50,
    posY: 50,
    fontSize: 48,
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    fontStyle: "normal"
  });
  
  const [imageOptions, setImageOptions] = useState<ImageOptions>({
    clipRatio: "none",
    clipX: 0,
    clipY: 0,
    posX: 0,
    posY: 0
  });
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      setResultUrl(null);
      
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setPreviewUrl(null);
      setResultUrl(null);
    }
  }, [imageFile]);
  
  const generateImage = async () => {
    if (!previewUrl) return;
    
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (imageOptions.clipRatio !== "none") {
        const clipX = (imageOptions.clipX / 100) * img.width;
        const clipY = (imageOptions.clipY / 100) * img.height;
        const clipWidth = img.width - (clipX * 2);
        const clipHeight = img.height - (clipY * 2);
        
        ctx.drawImage(
          img,
          clipX, clipY, clipWidth, clipHeight,
          imageOptions.posX, imageOptions.posY, clipWidth, clipHeight
        );
      } else {
        ctx.drawImage(img, imageOptions.posX, imageOptions.posY);
      }
      
      ctx.font = `${textOptions.fontStyle} ${textOptions.fontWeight} ${textOptions.fontSize}px ${textOptions.fontFamily}`;
      ctx.fillStyle = textOptions.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      const textX = (canvas.width * textOptions.posX) / 100;
      const textY = (canvas.height * textOptions.posY) / 100;
      
      ctx.fillText(textOptions.text, textX, textY);
      
      setResultUrl(canvas.toDataURL("image/png"));
    };
    
    img.src = previewUrl;
  };
  
  const downloadImage = (format: "png" | "jpg") => {
    if (!resultUrl) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let downloadUrl;
    let filename;
    
    if (format === "png") {
      downloadUrl = resultUrl;
      filename = "lgtm-image.png";
    } else {
      downloadUrl = canvas.toDataURL("image/jpeg", 0.9);
      filename = "lgtm-image.jpg";
    }
    
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return {
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
  };
}
