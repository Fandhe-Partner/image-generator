import React from 'react';
import './ImagePreview.css';

interface ImagePreviewProps {
  imageUrl: string;
  alt?: string;
}

const ImagePreview = ({ imageUrl, alt = 'Preview' }: ImagePreviewProps) => {
  return (
    <div className="image-preview">
      <img src={imageUrl} alt={alt} className="preview-image" />
    </div>
  );
};

export default ImagePreview;
