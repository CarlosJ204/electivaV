import { Alert, Platform } from "react-native";

/** Alert.alert no funciona en web, por eso se usa window.alert allí. */
export const notify = (title: string, message: string) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};
