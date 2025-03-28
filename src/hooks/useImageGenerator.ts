import { useState, useCallback } from 'react';
import { TextOptions, addTextToImage, downloadImage } from '../services/imageService';

interface UseImageGeneratorReturn {
  image: File | null;
  previewUrl: string | null;
  resultUrl: string | null;
  textOptions: TextOptions;
  isGenerating: boolean;
  setImage: (file: File | null) => void;
  setTextContent: (content: string) => void;
  setTextPosition: (x: number, y: number) => void;
  setFontSize: (size: number) => void;
  generateImage: () => Promise<void>;
  downloadResult: (filename?: string) => void;
}

export const useImageGenerator = (): UseImageGeneratorReturn => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textOptions, setTextOptions] = useState<TextOptions>({
    content: 'LGTM',
    x: 0.5, // center
    y: 0.5, // center
    fontSize: 48,
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  });

  const handleSetImage = useCallback((file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultUrl(null);
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setResultUrl(null);
    }
    setImage(file);
  }, [previewUrl]);

  const setTextContent = useCallback((content: string) => {
    setTextOptions(prev => ({ ...prev, content }));
    setResultUrl(null);
  }, []);

  const setTextPosition = useCallback((x: number, y: number) => {
    setTextOptions(prev => ({ ...prev, x, y }));
    setResultUrl(null);
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    setTextOptions(prev => ({ ...prev, fontSize }));
    setResultUrl(null);
  }, []);

  const generateImage = useCallback(async () => {
    if (!image) return;

    setIsGenerating(true);
    try {
      const result = await addTextToImage(image, textOptions);
      setResultUrl(result);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [image, textOptions]);

  const downloadResult = useCallback((filename?: string) => {
    if (resultUrl) {
      downloadImage(resultUrl, filename || `LGTM_${Date.now()}.png`);
    }
  }, [resultUrl]);

  return {
    image,
    previewUrl,
    resultUrl,
    textOptions,
    isGenerating,
    setImage: handleSetImage,
    setTextContent,
    setTextPosition,
    setFontSize,
    generateImage,
    downloadResult,
  };
};
