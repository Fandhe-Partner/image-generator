import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import './TextControl.css';

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
    <div className="text-control">
      <div className="control-group">
        <label htmlFor="text-input">{t('text')}</label>
        <input
          id="text-input"
          type="text"
          value={text}
          onChange={handleTextChange}
          className="text-input"
          placeholder="LGTM"
        />
      </div>
      
      <div className="control-group">
        <label htmlFor="position-x">{t('position')} X</label>
        <input
          id="position-x"
          type="range"
          min="0"
          max="100"
          value={posX * 100}
          onChange={handleXChange}
          className="range-input"
        />
        <span className="range-value">{Math.round(posX * 100)}%</span>
      </div>
      
      <div className="control-group">
        <label htmlFor="position-y">{t('position')} Y</label>
        <input
          id="position-y"
          type="range"
          min="0"
          max="100"
          value={posY * 100}
          onChange={handleYChange}
          className="range-input"
        />
        <span className="range-value">{Math.round(posY * 100)}%</span>
      </div>
      
      <div className="control-group">
        <label htmlFor="font-size">{t('size')}</label>
        <input
          id="font-size"
          type="range"
          min="12"
          max="120"
          value={fontSize}
          onChange={handleFontSizeChange}
          className="range-input"
        />
        <span className="range-value">{fontSize}px</span>
      </div>
    </div>
  );
};

export default TextControl;
