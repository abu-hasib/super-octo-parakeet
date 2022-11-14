import * as React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
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

export default function RegisterScreen({ navigation }) {
  const [guest, setGuest] = React.useState("");
  const [password, setPassword] = React.useState("");
  const isDisabled = password === "" || guest === "";

  console.log(isDisabled);
  console.log(navigation);

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS guests (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
      );
    });
  }, []);
  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM guests",
        null, // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, { rows: { _array } }) => console.log("^^: ", _array),
        (txObj, error) => console.log("Error ", error)
      ); // end executeSQL
    });
  }, []);

  const register = (guestName, password) => {
    console.log("running...");
    console.log(guest, password);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO guests (username, password) values (?, ?)",
        [guestName, password],
        (txObj, resultSet) => {
          console.log("here");
        },
        (txObj, error) => console.log("Error", error)
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
          onChangeText={(email) => setGuest(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => register(guest, password)}
        disabled={isDisabled}
      >
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>
      <Button
        title="Go to login"
        style={styles.loginBtn}
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
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
