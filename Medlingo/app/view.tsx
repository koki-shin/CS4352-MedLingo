import React from "react";
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
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
      <View style={{ flex: 1, backgroundColor: "white" }}>
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

      <View className="p-4">
        {/* End Session */}
        <TouchableOpacity
          style={styles.bottom_button}
          onPress={() => router.back() }
        >
          <Text style={styles.button_text}>
            Return
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    bottom_button: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A4DA3',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#000000ff',
  },
  button_text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  }
});