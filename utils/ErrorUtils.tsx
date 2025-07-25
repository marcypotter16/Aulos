import Toast from "react-native-toast-message"

export const showError = (error: Error, title: string = "") => {
    Toast.show({
        type: "error",
        text1: title || "Error",
        text2: error.message
    })
}