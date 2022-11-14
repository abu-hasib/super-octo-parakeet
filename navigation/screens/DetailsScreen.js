import * as React from "react";
import { StyleSheet, View, Text, Linking } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

export default function DetailsScreen({ navigation }) {
  const logout = () => {
    
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This app is built by</Text>
      <Text
        style={{ color: "tomato", fontSize: 24, marginLeft: 4 }}
        onPress={() => Linking.openURL("https://ridwanabiola.netlify.app/")}
      >
        Ridwan
      </Text>
      <Button
        icon="exit-to-app"
        mode="contained"
        onPress={() => logout()}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
    // flexDirection: "row",
  },
  text: {
    fontSize: 24,
  },
});
