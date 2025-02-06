import useProfile from "@/hooks/useProfile";
import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function FleetsList() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();

  return <></>;
}

const stylesheet = createStyleSheet((theme) => ({}));
