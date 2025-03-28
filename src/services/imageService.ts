export interface TextOptions {
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

/**
 * Add text to an image
 * @param imageFile The image file
 * @param textOptions Options for the text
 * @returns Promise with the data URL of the new image
 */
export const addTextToImage = async (
  imageFile: File,
  textOptions: TextOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== 'string') {
        reject(new Error('Failed to load image'));
        return;
      }
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        ctx.font = `${textOptions.fontSize}px ${textOptions.fontFamily}`;
        ctx.fillStyle = textOptions.color;
        ctx.textAlign = 'center';
        
        ctx.fillText(
          textOptions.content,
          textOptions.x * img.width,
          textOptions.y * img.height
        );
        
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(imageFile);
  });
};

/**
 * Convert data URL to Blob for downloading
 * @param dataUrl Data URL
 * @returns Blob object
 */
export const dataURLtoBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Download image from data URL
 * @param dataUrl Data URL
 * @param filename Filename for download
 */
export const downloadImage = (dataUrl: string, filename: string = 'image.png'): void => {
  const blob = dataURLtoBlob(dataUrl);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
