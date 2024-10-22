import { useHeaderHeight } from "@react-navigation/elements";
import { useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import WebView from "react-native-webview";
import LoadingScreen from "../dataStates/LoadingScreen";

interface FileViewerProps {
  fileUrl: string;
}

export default function FileViewer({ fileUrl }: FileViewerProps) {
  const { styles } = useStyles(stylesheet);
  const [isWebViewLoading, setIsWebViewLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const webViewRef = useRef();

  const embeddedUrl = `http://docs.google.com/gview?embedded=true&url=${fileUrl}`;

  if (Platform.OS === "web") {
    return <iframe src={fileUrl} height={"100%"} width={"100%"} />;
  } else {
    return (
      <>
        {isWebViewLoading && (
          <View style={styles.container}>
            <LoadingScreen caption="Cargando documento" />
          </View>
        )}
        <WebView
          ref={webViewRef.current}
          javaScriptEnabled={true}
          source={{ uri: Platform.OS === "ios" ? fileUrl : embeddedUrl }}
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
