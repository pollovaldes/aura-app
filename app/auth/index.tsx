import { setStatusBarStyle, StatusBar } from "expo-status-bar";

import { useEffect } from "react";
import Card from "./Card";

export default function Authentication() {
  useEffect(() => {
    setStatusBarStyle("light");
  }, []);

  return (
    <>
      <Card />
      <StatusBar style="light" />
    </>
  );
}
