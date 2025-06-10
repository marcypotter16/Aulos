import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(tabs)/index"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="(tabs)/search"
        options={{ title: "Search" }}
      />  
      <Tabs.Screen
        name="(tabs)/profile"
        options={{ title: "Profile", headerShown: false }}
      />
    </Tabs>
  );
}