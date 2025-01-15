import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from "react-native-reanimated";
import { router } from "expo-router";
import { pickTextColor } from "../global/functions/pickTectColor";
import { useElapsedTime } from "../global/hooks/useElapsedTime";
import { useActiveRoute } from "./hooks/useActiveRoute";

export function RouteHeader() {
  const { styles, theme } = useStyles(stylesheet);
  const textColor = pickTextColor(theme.ui.colors.primary);
  const { activeRouteIdIsLoading, activeRouteIsLoading, activeRouteId, routes } = useActiveRoute();
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

  if (!activeRouteId && !activeRouteIdIsLoading && !activeRouteIsLoading) {
    return;
  }

  const activeRoute = routes[activeRouteId];

  return (
    <Pressable onPress={() => router.push("/tab/route_details/123")}>
      <View style={styles.container}>
        {activeRouteIdIsLoading || activeRouteIsLoading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <>
            <Animated.Text
              style={[styles.text(textColor), animatedTextStyle]}
              selectable={false}
              allowFontScaling={false}
            >
              Ruta en curso
            </Animated.Text>
            <Text style={styles.subtitle(textColor)} selectable={false} allowFontScaling={false}>
              {activeRoute ? getElapsedTimeSince(activeRoute?.started_at) : "Sin fecha de inicio"}
            </Text>
          </>
        )}
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
