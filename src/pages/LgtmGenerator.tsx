import { useTranslation } from 'react-i18next';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import TextControl from '../components/TextControl';
import { useImageGenerator } from '../hooks/useImageGenerator';

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-center mb-8">{t('lgtm')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
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
              
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={generateImage} 
                  disabled={isGenerating} 
                  className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-1"
                >
                  {isGenerating ? 'Generating...' : t('generate')}
                </button>
                
                {resultUrl && (
                  <button 
                    onClick={() => downloadResult()} 
                    className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex-1"
                  >
                    {t('download')}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex flex-col">
          {previewUrl && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium">Original</h3>
              <ImagePreview imageUrl={previewUrl} alt="Original" />
            </div>
          )}
          
          {resultUrl && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium">Result</h3>
              <ImagePreview imageUrl={resultUrl} alt="Result" />
            </div>
          )}
          
          {!previewUrl && (
            <div className="flex justify-center items-center h-[300px] bg-gray-50 border border-dashed border-gray-300 rounded-md text-gray-500">
              <p>Upload an image to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LgtmGenerator;
