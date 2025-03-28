import React from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import TextControl from '../components/TextControl';
import { useImageGenerator } from '../hooks/useImageGenerator';
import './LgtmGenerator.css';

const LgtmGenerator = () => {
  const { t } = useTranslation();
  const {
    image,
    previewUrl,
    resultUrl,
    textOptions,
    isGenerating,
    setImage,
    setTextContent,
    setTextPosition,
    setFontSize,
    generateImage,
    downloadResult
  } = useImageGenerator();

  return (
    <div className="lgtm-generator">
      <h1>{t('lgtm')}</h1>
      
      <div className="generator-container">
        <div className="controls-panel">
          <ImageUploader onImageSelect={setImage} />
          
          {image && (
            <>
              <TextControl
                text={textOptions.content}
                onTextChange={setTextContent}
                posX={textOptions.x}
                posY={textOptions.y}
                onPositionChange={setTextPosition}
                fontSize={textOptions.fontSize}
                onFontSizeChange={setFontSize}
              />
              
              <div className="action-buttons">
                <button 
                  onClick={generateImage} 
                  disabled={isGenerating} 
                  className="generate-button"
                >
                  {isGenerating ? 'Generating...' : 'Generate Image'}
                </button>
                
                {resultUrl && (
                  <button 
                    onClick={() => downloadResult()} 
                    className="download-button"
                  >
                    {t('download')}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="preview-panel">
          {previewUrl && (
            <div className="preview-container">
              <h3>Original</h3>
              <ImagePreview imageUrl={previewUrl} alt="Original" />
            </div>
          )}
          
          {resultUrl && (
            <div className="result-container">
              <h3>Result</h3>
              <ImagePreview imageUrl={resultUrl} alt="Result" />
            </div>
          )}
          
          {!previewUrl && (
            <div className="empty-state">
              <p>Upload an image to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LgtmGenerator;
