import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Card, Title, Paragraph, Chip } from "react-native-paper";

export default function HomeScreen() {
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setFetching] = useState(false);
  const [stories, setStories] = useState([]);
  const [offset, setOffset] = useState(0);

  const getStory = async (itemId) => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`
      );
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getStories = async (offset) => {
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
      );
      const json = await response.json();
      const slicedJson = json.slice(offset * 11, (offset + 1) * 11 - 1);
      // console.log("***: ", );
      const mappedStories = await Promise.all(
        slicedJson.map((id) => getStory(id))
      );
      console.log("%%: ", offset);
      setStories((data) => [...data, ...mappedStories]);
      console.log("*******: ", stories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getStories(offset);
  }, []);

  const loadMoreData = async (offset) => {
    setFetching(true);
    try {
      await getStories(offset);
    } catch (error) {
      console.error(error);
    } finally {
      setOffset((offset) => offset + 1);
      setFetching(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={({ id }, index) => index}
          renderItem={({ item }) => {
            return (
              <Card elevation={5} mode="elevated" style={{ marginBottom: 16 }}>
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Paragraph>{item.description}</Paragraph>
                </Card.Content>
                <Card.Actions style={{ color: "tomato" }}>
                  <Chip icon="information">{item.by}</Chip>
                  <Text icon="clock">
                    {new Date(item.time * 1000).toDateString()}
                  </Text>
                </Card.Actions>
              </Card>
            );
          }}
          onEndReached={() => loadMoreData(offset)}
          onEndReachedThreshold={0.1}
          maxToRenderPerBatch={10}
          // updateCellsBatchingPeriod={20}
          ListFooterComponent={
            <Footer isFetching={isFetching} loadMoreData={loadMoreData} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    height: "100%",
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  newsBar: {
    height: 128,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 8,
    width: "100%",
    // shadowColor: "#000",
    fontSize: 14,
    elevation: 5,
  },
  title: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  time: {
    fontSize: 12,
  },
  by: {
    fontSize: 12,
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "tomato",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});

const Footer = ({ isFetching, loadMoreData }) => {
  return (
    //Footer View with Load More button
    <View style={styles.footer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={loadMoreData}
        //On Click of button calling loadMoreData function to load more data
        style={styles.loadMoreBtn}
      >
        <Text style={styles.btnText}>Loading</Text>
        {isFetching ? (
          <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
