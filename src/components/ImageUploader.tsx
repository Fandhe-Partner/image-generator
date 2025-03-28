import React, { useRef, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
}

const ImageUploader = ({ onImageSelect }: ImageUploaderProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="file-input"
      />
      <button onClick={handleButtonClick} className="upload-button">
        {t('upload')}
      </button>
    </div>
  );
};

export default ImageUploader;
