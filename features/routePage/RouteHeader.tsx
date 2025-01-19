import React, { useEffect } from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import { pickTextColor } from "../global/functions/pickTectColor";
import { useElapsedTime } from "../global/hooks/useElapsedTime";
import { useActiveRoute } from "./hooks/useActiveRoute";
import useProfile from "@/hooks/useProfile";

export function RouteHeader() {
  const { styles, theme } = useStyles(stylesheet);
  const textColor = pickTextColor(theme.ui.colors.primary);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { activeRoute, activeRouteIsLoading } = useActiveRoute(profile.id);
  const { getElapsedTimeSince } = useElapsedTime();

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
    return { opacity: opacity.value };
  });

  if (activeRouteIsLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={textColor} />
      </View>
    );
  }

  if (!activeRoute || !activeRoute.is_active) {
    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.text(textColor), animatedTextStyle]}>Sin ruta activa</Animated.Text>
      </View>
    );
  }

  // If the route is active, display info
  return (
    <Pressable onPress={() => router.push(`/tab/route_details`)}>
      <View style={styles.container}>
        <Animated.Text style={[styles.text(textColor), animatedTextStyle]} selectable={false} allowFontScaling={false}>
          Ruta en curso
        </Animated.Text>
        <Text style={styles.subtitle(textColor)} selectable={false} allowFontScaling={false}>
          {getElapsedTimeSince(activeRoute.started_at)}
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
