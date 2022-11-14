import { AppRegistry } from "react-native";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import MainContainer from "./navigation/MainContainer";
import { name as appName } from "./app.json";

const theme = {
  ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "tomato",
    secondary: "blue",
    tertiary: "biege",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <MainContainer />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
