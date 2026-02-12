import { useState, useRef, useCallback } from 'react';
import { Upload, Download, RefreshCw, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface EmojiVariant {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  dataUrl: string;
}

function App() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [emojiVariants, setEmojiVariants] = useState<EmojiVariant[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [cropSize, setCropSize] = useState([512]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  }, []);

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        generateEmojiVariants(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const generateEmojiVariants = async (img: HTMLImageElement) => {
    setIsProcessing(true);
    const variants: EmojiVariant[] = [];

    // Define different emoji styles
    const styles = [
      { id: 'original', name: 'Original', filter: 'none' },
      { id: 'bright', name: 'Bright', filter: 'brightness(1.3) contrast(1.1)' },
      { id: 'vibrant', name: 'Vibrant', filter: 'saturate(1.5) contrast(1.2)' },
      { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.2)' },
      { id: 'warm', name: 'Warm', filter: 'sepia(0.3) saturate(1.3)' },
      { id: 'vintage', name: 'Vintage', filter: 'sepia(0.5) contrast(0.9) brightness(1.1)' },
      { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(1) contrast(1.1)' },
      { id: 'inverted', name: 'Inverted', filter: 'invert(1)' },
      { id: 'pop', name: 'Pop Art', filter: 'saturate(2) contrast(1.5)' },
      { id: 'dreamy', name: 'Dreamy', filter: 'blur(1px) brightness(1.1) saturate(0.8)' },
      { id: 'sharp', name: 'Sharp', filter: 'contrast(1.4) brightness(0.95)' },
      { id: 'soft', name: 'Soft', filter: 'brightness(1.05) contrast(0.85) saturate(0.9)' },
    ];

    for (const style of styles) {
      const canvas = document.createElement('canvas');
      const size = cropSize[0];
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Apply filter
        ctx.filter = style.filter;

        // Calculate dimensions to crop center of image
        const scale = Math.max(size / img.width, size / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (size - scaledWidth) / 2;
        const y = (size - scaledHeight) / 2;

        // Draw image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        const dataUrl = canvas.toDataURL('image/png');
        variants.push({
          id: style.id,
          name: style.name,
          canvas,
          dataUrl,
        });
      }
    }

    setEmojiVariants(variants);
    setIsProcessing(false);
  };

  const downloadEmoji = (variant: EmojiVariant) => {
    const link = document.createElement('a');
    link.download = `emoji-${variant.id}.png`;
    link.href = variant.dataUrl;
    link.click();
  };

  const downloadAllEmojis = () => {
    emojiVariants.forEach((variant) => {
      setTimeout(() => downloadEmoji(variant), 100 * emojiVariants.indexOf(variant));
    });
  };

  const regenerateEmojis = () => {
    if (uploadedImage) {
      generateEmojiVariants(uploadedImage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smile className="w-12 h-12 text-orange-600" />
            <h1 className="text-5xl font-bold text-gray-900">Emoji Maker</h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload uma imagem e crie emojis incríveis em vários estilos
          </p>
        </div>

        {/* Upload Area */}
        {!uploadedImage && (
          <Card className="mb-8 border-2 border-dashed border-gray-300 bg-white/80 backdrop-blur">
            <CardContent className="p-12">
              <div
                className={`text-center transition-colors ${
                  isDragging ? 'bg-orange-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                  Arraste uma imagem ou clique para selecionar
                </h3>
                <p className="text-gray-500 mb-6">
                  PNG, JPG, GIF até 10MB
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Escolher Imagem
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center mb-8">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-orange-600 animate-spin" />
            <p className="text-lg text-gray-700">Gerando suas variações de emoji...</p>
          </div>
        )}

        {/* Controls and Results */}
        {uploadedImage && emojiVariants.length > 0 && (
          <div className="space-y-6">
            {/* Controls */}
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Tamanho do Emoji: {cropSize[0]}px
                    </label>
                    <Slider
                      value={cropSize}
                      onValueChange={setCropSize}
                      min={128}
                      max={1024}
                      step={64}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={regenerateEmojis}
                      variant="outline"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerar
                    </Button>
                    <Button
                      onClick={downloadAllEmojis}
                      className="gap-2 bg-orange-600 hover:bg-orange-700"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Todos
                    </Button>
                    <Button
                      onClick={() => {
                        setUploadedImage(null);
                        setEmojiVariants([]);
                      }}
                      variant="outline"
                    >
                      Nova Imagem
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emoji Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {emojiVariants.map((variant) => (
                <Card
                  key={variant.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow bg-white/90 backdrop-blur"
                >
                  <CardContent className="p-4">
                    <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <img
                        src={variant.dataUrl}
                        alt={variant.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-center font-semibold mb-2 text-gray-800">
                      {variant.name}
                    </h3>
                    <Button
                      onClick={() => downloadEmoji(variant)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Crie emojis personalizados em segundos • Múltiplos estilos • Download gratuito</p>
        </div>
      </div>
    </div>
  );
}

export default App;
