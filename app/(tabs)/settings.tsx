import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../src/store/authStore";

export default function Settings() {
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log("Logout completato"); // DEBUG
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Settings</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 8,
    marginTop: 20
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});
