/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { StyleSheet, Text, View } from "react-native";
import PeopleMainScreen from "@/components/people/PeopleMainScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Page() {
  const { isAdmin } = useAuth();
  
  if(isAdmin) {
    return <PeopleMainScreen />;}
  else {
    return <Redirect href={'/trucks'}/>
  }
}

