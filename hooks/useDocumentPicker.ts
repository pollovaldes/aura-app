import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";

type DocumentPickerState = {
  assets: DocumentPicker.DocumentPickerAsset[] | null;
  output?: FileList | null;
};

type UseDocumentPickerReturn = {
  documentPickerResult: DocumentPickerState;
  pickDocument: () => Promise<void>;
};

const useDocumentPicker = (): UseDocumentPickerReturn => {
  const [documentPickerResult, setDocumentPickerResult] =
    useState<DocumentPickerState>({
      assets: null,
      output: null,
    });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Specify a particular MIME type or keep it generic
        copyToCacheDirectory: false, // Default behavior
      });

      if (result.assets) {
        setDocumentPickerResult({
          assets: result.assets,
          output: result.output,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
      // Set the state to indicate a failed request
      setDocumentPickerResult({
        assets: null,
        output: null,
      });
    }
  };

  return { documentPickerResult, pickDocument };
};

export default useDocumentPicker;
