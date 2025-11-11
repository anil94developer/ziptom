import React, { use, useEffect, useState } from "react";
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
import { profile, updateProfile } from "../../../redux/slices/authSlice";
import { showToast } from "../../../redux/slices/toastSlice";

const EditProfile = () => {
  const dispatch = useDispatch()
  const { loading, error, userDetails } = useSelector((state: any) => state.auth);

  const navigation = useNavigation();
  const [name, setName] = useState(userDetails?.name || "");
  const [email, setEmail] = useState(userDetails?.email || "");
  const [phone, setPhone] = useState(userDetails?.mobileNumber || "");
  const [dob, setDob] = useState(userDetails?.dob || "");
  const [gender, setGender] = useState("");



  useEffect(() => {
    dispatch(profile())
  }, [dispatch])



  const handleSave = async () => {
    try {
      let body = {
        name: name,
        email: email,
        dob: dob,
        gender: gender
      }
      await dispatch(updateProfile(body)).unwrap();
      dispatch(showToast({ message: "Update successfully", type: "success" }));
    } catch (err) {
      dispatch(showToast({ message: "Failed to Update", type: "error" }));
    }
    // Alert.alert("Profile Updated", "Your changes have been saved successfully.");
  };
  const handleDobChange = (text) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Auto insert slashes
    let formatted = cleaned;
    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }

    setDob(formatted);
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header
        title="Edit Profile"
        onBack={() => { navigation.goBack() }}
      // onAdd={() => console.log("Add clicked!")}
      />
      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone Number</Text>
        <Text
          style={styles.input}
        >
          {phone}
        </Text>

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dob}
          keyboardType="number-pad"
          onChangeText={handleDobChange}
          placeholder="DD/MM/YYYY"
        />

        {/* <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          placeholder="Male / Female / Other"
        /> */}
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
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginTop: 8,
    backgroundColor: "#fafafa",
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
