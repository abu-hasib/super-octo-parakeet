import * as React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { save } from "../../utils";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

export default function LoginScreen({ navigation, setUserId }) {
  const [guest, setGuest] = React.useState("");
  const [password, setPassword] = React.useState("");
  const isDisabled = password === "" || guest === "";

  console.log(isDisabled);

  const login = (guestName, password) => {
    db.transaction((tx) => {
      console.log("here");
      tx.executeSql(
        "SELECT id, username from guests WHERE username = ?",
        [guestName],
        (txObj, { rows: { _array } }) => {
          console.log(txObj);
          if (_array.length > 0) save("guestId", JSON.stringify(_array[0].id));
          else console.log("no");
        },
        (txObj, error) => console.error(error)
      );
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="username"
          placeholderTextColor="#003f5c"
          onChangeText={(guestName) => setGuest(guestName)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => login(guest, password)}
        disabled={isDisabled}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 10,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 2,
    marginLeft: 20,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
});
