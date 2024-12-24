// useWebPConverter.ts
import { useState } from "react";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

type ConvertOptions = {
  compress?: number;
  width?: number;
  height?: number;
};

type UseWebPConverterReturn = {
  convertToWebP: (imageUri: string, options?: ConvertOptions) => Promise<void>;
  convertedUri: string | null;
  loading: boolean;
};

export default function useWebPConverter(): UseWebPConverterReturn {
  const [convertedUri, setConvertedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const convertToWebP = async (imageUri: string, options: ConvertOptions = { compress: 0.8 }): Promise<void> => {
    if (!imageUri) return;

    setLoading(true);
    try {
      const actions = [];
      if (options.width || options.height) {
        actions.push({ resize: { width: options.width, height: options.height } });
      }

      const manipResult = await manipulateAsync(imageUri, actions, {
        compress: options.compress ?? 0.8,
        format: SaveFormat.WEBP,
      });

      setConvertedUri(manipResult.uri);
    } catch (err) {
      console.error("Error converting to WebP:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    convertToWebP,
    convertedUri,
    loading,
  };
}
