import React from "react";
import { View, ActivityIndicator, Text, Button } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewPDF() {
  const { uri } = useLocalSearchParams();
  const router = useRouter();
  return (
    <SafeAreaView 
      style={{ flex: 1 }} 
      className="bg-white" 
      edges={["top", "bottom"]}
    >
      {/* title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#0A4DA3",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Saved Form PDF
      </Text>

      {/* pdf */}
      <View style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          mixedContentMode="always"
          useWebKit
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator size="large" style={{ marginTop: 10 }} />
          )}
          source={{ uri: uri as string }}
        />
      </View>

      {/* return */}
      <View className="p-4">
        <Button title= "Back" onPress={() => router.back() }/>
      </View>
    </SafeAreaView>
  );
}
