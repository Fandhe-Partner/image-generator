import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface TextControlProps {
  text: string;
  onTextChange: (text: string) => void;
  posX: number;
  posY: number;
  onPositionChange: (x: number, y: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const TextControl = ({
  text,
  onTextChange,
  posX,
  posY,
  onPositionChange,
  fontSize,
  onFontSizeChange,
}: TextControlProps) => {
  const { t } = useTranslation();

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTextChange(e.target.value);
  };

  const handleXChange = (e: ChangeEvent<HTMLInputElement>) => {
    const x = Number(e.target.value) / 100;
    onPositionChange(x, posY);
  };

  const handleYChange = (e: ChangeEvent<HTMLInputElement>) => {
    const y = Number(e.target.value) / 100;
    onPositionChange(posX, y);
  };

  const handleFontSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFontSizeChange(Number(e.target.value));
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <label htmlFor="text-input" className="block mb-2 font-medium">{t('text')}</label>
        <input
          id="text-input"
          type="text"
          value={text}
          onChange={handleTextChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="LGTM"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="position-x" className="block mb-2 font-medium">{t('position')} X</label>
        <div className="flex items-center">
          <input
            id="position-x"
            type="range"
            min="0"
            max="100"
            value={posX * 100}
            onChange={handleXChange}
            className="w-[85%] mr-2"
          />
          <span className="min-w-[40px] text-right text-sm text-gray-600">{Math.round(posX * 100)}%</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="position-y" className="block mb-2 font-medium">{t('position')} Y</label>
        <div className="flex items-center">
          <input
            id="position-y"
            type="range"
            min="0"
            max="100"
            value={posY * 100}
            onChange={handleYChange}
            className="w-[85%] mr-2"
          />
          <span className="min-w-[40px] text-right text-sm text-gray-600">{Math.round(posY * 100)}%</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="font-size" className="block mb-2 font-medium">{t('size')}</label>
        <div className="flex items-center">
          <input
            id="font-size"
            type="range"
            min="12"
            max="120"
            value={fontSize}
            onChange={handleFontSizeChange}
            className="w-[85%] mr-2"
          />
          <span className="min-w-[40px] text-right text-sm text-gray-600">{fontSize}px</span>
        </div>
      </div>
    </div>
  );
};

export default TextControl;
