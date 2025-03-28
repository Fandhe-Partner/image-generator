interface ImagePreviewProps {
  imageUrl: string;
  alt?: string;
}

const ImagePreview = ({ imageUrl, alt = 'Preview' }: ImagePreviewProps) => {
  return (
    <div className="mb-6 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
      <img src={imageUrl} alt={alt} className="block max-w-full max-h-96 mx-auto" />
    </div>
  );
};

export default ImagePreview;
