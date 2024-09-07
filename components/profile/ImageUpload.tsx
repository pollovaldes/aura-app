import { useSession } from "@/context/SessionContext";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { FileObject } from '@supabase/storage-js'
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Camera } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "@/lib/supabase";
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import ImageItem from "./ImageRender";



export default function ImageUpload() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const { styles } = useStyles(stylesheet);
  const session = useSession();
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    if (!session) return;

    loadImages();
  }, [session?.user])

  const loadImages = async () => {
    const { data } = await supabase.storage.from('avatars').list(session?.user!.id);
    if (data) {
      setFiles(data);
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {encoding: 'base64'});
      const filePath = `${session?.user!.id}/${new Date().getTime()}.${img.type === 'image'}`;
      const contentType = img.type === 'image' ? 'image/png' : "null" ;
      await supabase.storage.from('avatars').upload(filePath, decode(base64), {contentType});
      await loadImages();
    }
  };

  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    supabase.storage.from('files').remove([`${session?.user!.id}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(listIndex, 1);
    setFiles(newFiles);
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style = {{ flex: 1}}>
        <TouchableOpacity onPress = {onSelectImage}>
          <Camera style = {{justifyContent: 'center'}} />
          {files.map((item, index) => (
          <ImageItem key={item.id} item={item} userId={session ? session?.user!.id : 'null'} onRemoveImage={() => onRemoveImage(item, index)} />
        ))}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    padding: 20,
  },
}));