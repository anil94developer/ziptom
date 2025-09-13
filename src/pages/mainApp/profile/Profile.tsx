import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useAppNavigation } from "../../../utils/functions";
import { useTheme } from "../../../theme/ThemeContext";
import { Portal, Dialog, Button, Provider as PaperProvider } from "react-native-paper";

const Profile = () => {
  const { colors, setTheme } = useTheme();
  const { goToEditProfile } = useAppNavigation();
  const navigation = useNavigation();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [vegMode, setVegMode] = useState(false);
  const [appearance, setAppearance] = useState("Automatic");
  const [rating, setRating] = useState<number | null>(null);

  // Logout state
  const [logoutVisible, setLogoutVisible] = useState(false);

  const closeModal = () => setActiveModal(null);

  const handleLogout = () => {
    setLogoutVisible(false);
    // 👉 Add your real logout logic here
    console.log("User Logged Out");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // redirect to login/auth screen
    });
  };

  return (
    <PaperProvider>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <Header title="Profile" onBack={() => navigation.goBack()} />

        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.border }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>G</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.text }]}>Gungun</Text>
            <TouchableOpacity>
              <Text style={[styles.activityText, { color: colors.primary }]}>
                View activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Section */}
        <TouchableOpacity
          style={[styles.goldCard, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.goldText, { color: colors.onPrimary }]}>
            🌟 Join Foodie Gold
          </Text>
          <MaterialIcons name="chevron-right" size={24} color={colors.onPrimary} />
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.row}>
          <View style={[styles.box, { backgroundColor: colors.surface }]}>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={[styles.boxText, { color: colors.text }]}>Wallet</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>₹0</Text>
          </View>
          <View style={[styles.box, { backgroundColor: colors.surface }]}>
            <MaterialIcons
              name="local-offer"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={[styles.boxText, { color: colors.text }]}>Coupons</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              2 Available
            </Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => setActiveModal("update")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              App update available
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => goToEditProfile()}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Your profile
            </Text>
            <Text
              style={[
                styles.badge,
                { backgroundColor: colors.primary, color: colors.textSecondary },
              ]}
            >
              32% completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => setActiveModal("veg")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>Veg Mode</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              {vegMode ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => setActiveModal("appearance")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>Appearance</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              {appearance}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => setActiveModal("rating")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Your Rating
            </Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              {rating ? `${rating} ★` : "-- ★"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.primary }]}
          onPress={() => setLogoutVisible(true)}
        >
          <MaterialIcons name="logout" size={22} color={colors.primary} />
          <Text style={[styles.logoutText, { color: colors.primary }]}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* MODALS (Update, Veg, Appearance, Rating) */}
        <Modal visible={activeModal === "update"} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                App Update
              </Text>
              <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                A new version of the app is available. Update now for better
                performance and features.
              </Text>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={closeModal}
              >
                <Text style={[styles.actionText, { color: colors.onPrimary }]}>
                  Update Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={activeModal === "veg"} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Veg Mode
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                  Enable Veg Only Mode
                </Text>
                <Switch
                  value={vegMode}
                  onValueChange={setVegMode}
                  style={{ marginLeft: 10 }}
                  thumbColor={vegMode ? colors.primary : colors.border}
                />
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={[styles.closeText, { color: colors.text }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={activeModal === "appearance"} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Appearance
              </Text>
              {["Light", "Dark", "Automatic"].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.optionBtn, { borderColor: colors.border }]}
                  onPress={() => {
                    setAppearance(mode);
                    setTheme(mode.toLowerCase());
                    closeModal();
                  }}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{mode}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <Modal visible={activeModal === "rating"} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Your Rating
              </Text>
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => {
                      setRating(star);
                      closeModal();
                    }}
                  >
                    <MaterialIcons
                      name={rating && rating >= star ? "star" : "star-border"}
                      size={30}
                      color={colors.primary}
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={[styles.closeText, { color: colors.text }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={logoutVisible} onDismiss={() => setLogoutVisible(false)}>
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutVisible(false)}>Cancel</Button>
            <Button onPress={handleLogout}>Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: { fontSize: 20, fontWeight: "bold" },
  userName: { fontSize: 18, fontWeight: "bold" },
  activityText: { fontSize: 13, marginTop: 4 },
  goldCard: {
    padding: 15,
    margin: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goldText: { fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  box: {
    width: "45%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  boxText: { fontWeight: "bold", marginTop: 5 },
  subText: { fontSize: 12, marginTop: 3 },
  menu: { marginTop: 20 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
  },
  menuText: { fontSize: 15 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 14 },
  actionBtn: {
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  actionText: { fontWeight: "bold" },
  closeBtn: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  optionBtn: {
    padding: 12,
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 15 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    margin: 20,
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
