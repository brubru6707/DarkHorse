'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface PixelatedImageProps {
  base64Image: string;
  pixelationFactor?: number;
}

const PixelatedImageDisplay: React.FC<PixelatedImageProps> = ({
  base64Image,
  pixelationFactor = 8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const applyPixelation = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image || !isImageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    const downscaledWidth = Math.max(1, Math.floor(canvas.width / pixelationFactor));
    const downscaledHeight = Math.max(1, Math.floor(canvas.height / pixelationFactor));

    ctx.drawImage(image, 0, 0, downscaledWidth, downscaledHeight);
    ctx.drawImage(canvas, 0, 0, downscaledWidth, downscaledHeight, 0, 0, canvas.width, canvas.height);

  }, [base64Image, pixelationFactor, isImageLoaded]);

  useEffect(() => {
    if (isImageLoaded) {
      applyPixelation();
    }
  }, [applyPixelation, isImageLoaded]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (!base64Image) {
    return <p>No image data to display.</p>;
  }

  return (
    <div>
      <Image
        ref={imageRef}
        src={`data:image/png;base64,${base64Image}`}
        alt="Generated Image"
        style={{ display: 'none' }}
        onLoad={handleImageLoad}
        onError={(e) => console.error("Error loading image for pixelation:", e.currentTarget.src)}
      />
      <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc' }} />
    </div>
  );
};

export default PixelatedImageDisplay;