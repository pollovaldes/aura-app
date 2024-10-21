import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
import { Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import WebView from "react-native-webview";
import LoadingScreen from "../dataStates/LoadingScreen";

interface FileViewerProps {
  url: string;
}

export default function FileViewer({ url }: FileViewerProps) {
  const { styles } = useStyles(stylesheet);
  const [isWebViewLoading, setIsWebViewLoading] = useState(false);
  const headerHeight = useHeaderHeight();

  return (
    <>
      {isWebViewLoading && (
        <View style={styles.container}>
          <LoadingScreen caption="Cargando documento" />
        </View>
      )}
      <WebView
        javaScriptEnabled={true}
        source={{ uri: url }}
        onLoadStart={(syntheticEvent) => {
          setIsWebViewLoading(true);
        }}
        onLoadEnd={(syntheticEvent) => {
          setIsWebViewLoading(false);
        }}
        style={{
          marginTop: Platform.OS === "ios" ? headerHeight : 0,
        }}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 10000, // This is a hack to make the LoadingScreen fill the screen
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.textPresets.main,
  },
}));
