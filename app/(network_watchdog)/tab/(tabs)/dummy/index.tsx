//THIS IS FOR THE TAB BAR POSITION; DONT CHANGE THIS FILE

import { Redirect, router } from "expo-router";

export default function Index() {
  if (router.canGoBack()) {
    router.back();
  } else {
    return <Redirect href="/tab/vehicles" />;
  }
}
