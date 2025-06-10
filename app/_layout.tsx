import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(tabs)/home"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="(tabs)/profile"
        options={{ title: "Profile" }}
      />
      <Tabs.Screen
        name="(tabs)/saved"
        options={{ title: "Saved" }}
      />
    </Tabs>
  );
}