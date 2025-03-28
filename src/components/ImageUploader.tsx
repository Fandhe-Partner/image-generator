import { useRef, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

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
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button 
        onClick={handleButtonClick} 
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
      >
        {t('upload')}
      </button>
    </div>
  );
};

export default ImageUploader;
