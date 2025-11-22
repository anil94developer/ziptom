import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { profile, updateProfile } from "../../../redux/slices/authSlice";
import { showToast } from "../../../redux/slices/toastSlice";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, userDetails } = useSelector((state: any) => state.auth);

  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [dietPreference, setDietPreference] = useState("");
  const [eatFrom, setEatFrom] = useState("");
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState({});



  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  // Update form fields when userDetails are loaded
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setDietPreference(userDetails.diet_preference || "");
      setEatFrom(userDetails.eat_from || "");
      setGender(userDetails.gender || "");
      setPreference(userDetails.preference || {});
    }
  }, [userDetails]);

  const handleSave = async () => {
    try {
      const body: any = {
        name: name,
        diet_preference: dietPreference,
        eat_from: eatFrom,
        gender: gender || null,
        preference: preference,
        // Include address if it exists in userDetails
        address: userDetails?.address || [],
      };

      await dispatch(updateProfile(body) as any).unwrap();
      dispatch(showToast({ message: "Profile updated successfully", type: "success" }));
      // Refresh profile data after update
      dispatch(profile());
      navigation.goBack();
    } catch (err: any) {
      dispatch(showToast({ 
        message: err || "Failed to update profile", 
        type: "error" 
      }));
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header
        title="Edit Profile"
        onBack={() => navigation.goBack()}
        // onAdd={() => {}}
      />
      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Phone Number</Text>
        <Text style={[styles.input, styles.disabledInput]}>
          {userDetails?.mobileNumber || "N/A"}
        </Text>
        <Text style={styles.hintText}>Phone number cannot be changed</Text>

        <Text style={styles.label}>Diet Preference</Text>
        <TextInput
          style={styles.input}
          value={dietPreference}
          onChangeText={setDietPreference}
          placeholder="e.g., vegetarian, non-vegetarian"
        />

        <Text style={styles.label}>Eat From</Text>
        <TextInput
          style={styles.input}
          value={eatFrom}
          onChangeText={setEatFrom}
          placeholder="e.g., home, restaurant"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {["male", "female", "other"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                gender === option && styles.genderOptionSelected,
              ]}
              onPress={() => setGender(option)}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === option && styles.genderTextSelected,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Save Button */}
      {loading ? <Text style={styles.saveBtn} >Updating...</Text>
      :
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  form: { padding: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  hintText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
  genderOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  genderOptionSelected: {
    borderColor: "#f44336",
    backgroundColor: "#fff5f5",
  },
  genderText: {
    fontSize: 14,
    color: "#666",
  },
  genderTextSelected: {
    color: "#f44336",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default EditProfile;
