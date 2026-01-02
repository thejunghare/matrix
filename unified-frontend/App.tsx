if (!Promise.withResolvers) {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { createClient } from "matrix-js-sdk";

// --- CONFIG ---
const HOMESERVER = "http://192.168.1.33:8008";
const BOT_ID = "@whatsappbot:192.168.1.33";
const USER = "@admin:192.168.1.33";
const HARDCODED_TOKEN = "YOUR_ACCESS_TOKEN_HERE"; // Use your token if login fails
// -------------

export default function App() {
  const [client, setClient] = useState(null);
  const [logs, setLogs] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [inputText, setInputText] = useState("");

  const addLog = (msg) => {
    console.log(msg); // Log to terminal too
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        type: "log",
        text: String(msg),
      },
    ]);
  };

  const initMatrix = async () => {
    addLog("Initializing...");

    // SKIP LOGIN FOR NOW IF IT KEEPS FAILING, USE TOKEN DIRECTLY
    /* try {
        const authClient = createClient({ baseUrl: HOMESERVER });
        const loginRes = await authClient.login("m.login.password", { user: USER, password: "password123" });
        // ... use loginRes.access_token
    } catch ...
    */

    // Let's assume you have the token or login works:
    try {
      let accessToken = HARDCODED_TOKEN;
      let userId = USER;

      if (!accessToken || accessToken === "YOUR_ACCESS_TOKEN_HERE") {
        // RE-ENABLE LOGIN IF YOU FIXED THE RATE LIMIT
        const authClient = createClient({ baseUrl: HOMESERVER });
        const loginRes = await authClient.login("m.login.password", {
          user: USER,
          password: "password123",
        });
        accessToken = loginRes.access_token;
      }

      const mxClient = createClient({
        baseUrl: HOMESERVER,
        accessToken: accessToken,
        userId: USER,
      });

      mxClient.on("sync", (state) => {
        if (state === "PREPARED") {
          addLog("Client Ready!");
          setClient(mxClient);
        }
      });

      mxClient.on("Room.timeline", (event, room) => {
        if (event.getType() !== "m.room.message") return;
        if (roomId && room.roomId !== roomId) return;

        const content = event.getContent();
        const sender = event.getSender();

        if (content.msgtype === "m.image" && content.url) {
          // Try multiple conversion methods
          let httpUrl = mxClient.mxcUrlToHttp(
            content.url,
            500,
            500,
            "scale",
            false,
          );

          // Fallback: manual conversion
          if (!httpUrl && content.url.startsWith("mxc://")) {
            const mxcParts = content.url.replace("mxc://", "").split("/");
            const serverName = mxcParts[0];
            const mediaId = mxcParts[1];
            httpUrl = `${HOMESERVER}/_matrix/media/r0/download/${serverName}/${mediaId}`;
          }

          addLog(`[DEBUG] Using URL: ${httpUrl}`);

          setLogs((prev) => [
            ...prev,
            {
              id: event.getId(),
              type: "image",
              url: httpUrl,
              sender: String(sender),
            },
          ]);
        } else {
          setLogs((prev) => [
            ...prev,
            {
              id: event.getId(),
              type: "text",
              text: `${sender}: ${content.body}`,
            },
          ]);
        }
      });

      await mxClient.startClient({ initialSyncLimit: 1 });
    } catch (e) {
      addLog("Error: " + e.message);
    }
  };

  useEffect(() => {
    initMatrix();
  }, []);

  const startSetup = async () => {
    if (!client) return;
    try {
      addLog("Creating room...");
      const res = await client.createRoom({
        invite: [BOT_ID],
        preset: "trusted_private_chat",
        is_direct: true,
      });
      setRoomId(res.room_id);
      addLog("Room Created: " + res.room_id);

      // ADD THIS: Wait for bot to join
      addLog("Waiting for bot to join...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Give it 2 seconds

      // ADD THIS: Check room members
      const room = client.getRoom(res.room_id);
      const members = room.getJoinedMembers();
      addLog(`Room members: ${members.map((m) => m.userId).join(", ")}`);
    } catch (e) {
      addLog("Create Room Error: " + e.message);
    }
  };

  const sendMessage = (txt) => {
    if (!client || !roomId) return;
    client.sendEvent(
      roomId,
      "m.room.message",
      { body: txt, msgtype: "m.text" },
      "",
    );
    setInputText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="Start Setup" onPress={startSetup} disabled={!client} />
        <Button
          title="Send Login"
          onPress={() => sendMessage("!wa login qr")}
          disabled={!roomId}
        />
      </View>

      <FlatList
        style={styles.flatList} // ADD THIS
        contentContainerStyle={styles.flatListContent} // ADD THIS
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.type === "image") {
            return (
              <View style={styles.msgBox}>
                <Text style={styles.sender}>{item.sender} sent QR:</Text>
                <Image
                  source={{ uri: item.url }}
                  style={{ width: 250, height: 250, backgroundColor: "#eee" }}
                  resizeMode="contain"
                  onLoadStart={() => addLog(`[IMAGE] Loading: ${item.url}`)}
                  onLoad={() => addLog(`[IMAGE] Loaded successfully`)}
                  onError={(e) =>
                    addLog(
                      `[IMAGE] Load error: ${JSON.stringify(e.nativeEvent)}`,
                    )
                  }
                />
              </View>
            );
          }
          return (
            <View style={styles.msgBox}>
              <Text style={item.type === "log" ? styles.log : styles.msg}>
                {String(item.text)}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type command..."
          placeholderTextColor="#999"
        />
        <Button title="Send" onPress={() => sendMessage(inputText)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1, // THIS IS KEY - takes remaining space
  },
  flatListContent: {
    paddingBottom: 10, // Adds breathing room at bottom
  },
  container: { flex: 1, backgroundColor: "#f2f2f2", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },
  msgBox: { padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  log: { color: "gray", fontSize: 12 },
  msg: { color: "black", fontSize: 16 },
  sender: { fontWeight: "bold", marginBottom: 5 },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
    color: "black",
  },
});
