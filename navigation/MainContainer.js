import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Home from "../Home";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import SplashScreen from "./screens/SplashScreen";
import { getValueFor } from "../utils";

const Stack = createNativeStackNavigator();

function MainContainer() {
  const [isLoading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    const init = async () => {
      try {
        setUserId(await getValueFor("guestId"));
        setLoading(false);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {userId === false ? (
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Root"
            options={{ headerShown: false, title: "Overview" }}
          >
            {(props) => <Home {...props} userId={userId} />}
          </Stack.Screen>
        )}

        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <LoginScreen {...props} setUserId={setUserId} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
