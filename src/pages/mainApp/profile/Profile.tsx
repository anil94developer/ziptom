import React, { useEffect, useState } from "react";
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
import { Portal, Dialog, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { profile, setUserDetails } from "../../../redux/slices/authSlice";
import { setVegType } from "../../../redux/slices/homeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const { colors, setTheme } = useTheme();
  const { goToEditProfile, goToLogin } = useAppNavigation();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent, userDetails } = useSelector((state: any) => state.auth);
  const { vegType } = useSelector((state: any) => state.home);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [appearance, setAppearance] = useState("Automatic");
  const [rating, setRating] = useState<number | null>(null);

  // Logout state
  const [logoutVisible, setLogoutVisible] = useState(false);

  const closeModal = () => setActiveModal(null);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (userData: any): number => {
    if (!userData) return 0;

    const fields = [
      userData.name,
      userData.mobileNumber,
      userData.diet_preference,
      userData.eat_from,
      userData.gender,
      userData.dob,
      userData.address && userData.address.length > 0,
      userData.preference && Object.keys(userData.preference).length > 0,
    ];

    const filledFields = fields.filter((field) => {
      if (typeof field === 'boolean') return field;
      return field !== null && field !== undefined && field !== '';
    }).length;

    const totalFields = fields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    return percentage;
  };

  const profileCompletion = calculateProfileCompletion(userDetails);

  const handleLogout = async () => {
    setLogoutVisible(false);
    // 👉 Add your real logout logic here
    console.log("User Logged Out");
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Login" }], // redirect to login/auth screen
    // });
    dispatch(setUserDetails({}))
    AsyncStorage.clear()
    goToLogin()
  };

  useEffect(()=>{
      dispatch(profile())
  },[dispatch])

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <Header title="Profile" onBack={() => navigation.goBack()} />

        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.border }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {userDetails?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {userDetails?.name || "User"}
            </Text>
            {userDetails?.mobileNumber && (
              <Text style={[styles.mobileText, { color: colors.textSecondary }]}>
                {userDetails.mobileNumber}
              </Text>
            )}
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
          <Text style={[styles.goldText, { color: "#fff" }]}>
            🌟 Ziptom Enjoy
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#fff" />
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
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              ₹ {userDetails?.wallet || "0"}
            </Text>
          </View>
          {/* <View style={[styles.box, { backgroundColor: colors.surface }]}>
            <MaterialIcons
              name="local-offer"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={[styles.boxText, { color: colors.text }]}>Coupons</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              2 Available
            </Text>
          </View> */}
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
                { backgroundColor: colors.primary, color: "#fff" },
              ]}
            >
              {profileCompletion}% completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => setActiveModal("veg")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>Veg Mode</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              {vegType ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => setActiveModal("appearance")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>Appearance</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              {appearance}
            </Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={[styles.menuItem, { borderColor: colors.border }]}
            onPress={() => setActiveModal("rating")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Your Rating
            </Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              {userDetails?.rating ? `${userDetails?.rating} ★` : "-- ★"}
            </Text>
          </TouchableOpacity> */}
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
                <Text style={[styles.actionText, { color: "#fff" }]}>
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
                  value={vegType}
                  onValueChange={(value) => {
                    dispatch(setVegType(value));
                  }}
                  style={{ marginLeft: 10 }}
                  thumbColor={vegType ? colors.primary : colors.border}
                />
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={[styles.closeBtnText, { color: colors.text }]}>
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
                    if (mode === "Light") {
                      setTheme("light");
                    } else if (mode === "Dark") {
                      setTheme("dark");
                    } else if (mode === "Automatic") {
                      setTheme("light"); // Default to light for automatic
                    }
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
                <Text style={[styles.closeBtnText, { color: colors.text }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      

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
    </ScrollView>
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
  mobileText: { fontSize: 14, marginTop: 2 },
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
  closeBtnText: {
    fontSize: 14,
    fontWeight: "500",
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
