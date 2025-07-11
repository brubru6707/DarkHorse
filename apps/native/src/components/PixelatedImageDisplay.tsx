import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
// Removed unused Image import and fixed missing Text import
import { Image as CanvasImage } from 'react-native';
import { Canvas } from 'react-native-canvas';

interface PixelatedImageProps {
  base64Image: string;
  pixelationFactor?: number;
}

const PixelatedImageDisplay: React.FC<PixelatedImageProps> = ({
  base64Image,
  pixelationFactor = 8,
}) => {
  const canvasRef = useRef<Canvas | null>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  useEffect(() => {
    if (!base64Image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const img = new CanvasImage(canvas);
    img.src = `data:image/png;base64,${base64Image}`;
    
    img.addEventListener('load', () => {
      setDimensions({
        width: img.width,
        height: img.height
      });

      // Downscale
      const imgWidth = (img as any).width;
      const imgHeight = (img as any).height;
      const downscaledWidth = Math.max(1, Math.floor(imgWidth / pixelationFactor));
      const downscaledHeight = Math.max(1, Math.floor(imgHeight / pixelationFactor));

      // Draw downscaled
      ctx.drawImage(img, 0, 0, downscaledWidth, downscaledHeight);
      
      // Upscale
      ctx.drawImage(canvas, 0, 0, downscaledWidth, downscaledHeight, 0, 0, imgWidth, imgHeight);
    });
  }, [base64Image, pixelationFactor]);

  if (!base64Image) {
    return <Text>No image data to display.</Text>;
  }

  return (
    <View>
      <Canvas 
        ref={canvasRef} 
        style={{
          width: dimensions.width,
          height: dimensions.height,
          borderWidth: 1,
          borderColor: '#ccc'
        }}
      />
    </View>
  );
};

export default PixelatedImageDisplay;