import React, { useEffect } from "react";
import { Pressable, Text, Touchable, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from "react-native-reanimated";
import { router } from "expo-router";
import { pickTextColor } from "../global/functions/pickTectColor";
import { useElapsedTime } from "../global/hooks/useElapsedTime";

export function RouteHeader() {
  const { styles, theme } = useStyles(stylesheet);
  const textColor = pickTextColor(theme.ui.colors.primary);
  const { getElapsedTimeSince, getStaticValues } = useElapsedTime();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [opacity]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Pressable onPress={() => router.push("/tab/route_details/123")}>
      <View style={styles.container}>
        <Animated.Text style={[styles.text(textColor), animatedTextStyle]} selectable={false} allowFontScaling={false}>
          Ruta en curso
        </Animated.Text>
        <Text style={styles.subtitle(textColor)} selectable={false} allowFontScaling={false}>
          {getElapsedTimeSince("2021-09-01 12:00:00")}
        </Text>
      </View>
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    height: runtime.insets.top + 50,
    backgroundColor: theme.ui.colors.primary,
    borderColor: theme.ui.colors.border,
    borderBottomWidth: runtime.hairlineWidth,
    paddingTop: runtime.insets.top - 5,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  text: (textColor: string) => ({
    color: textColor,
    fontSize: 18,
    fontWeight: "bold",
  }),
  subtitle: (textColor: string) => ({
    color: textColor,
    fontSize: 17,
    fontFamily: "SpaceMono",
  }),
}));
