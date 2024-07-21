import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import Card from "./Card";
import { useEffect } from "react";

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
