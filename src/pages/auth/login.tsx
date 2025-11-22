import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator, ScrollView } from 'react-native';
import AppTextInput from '../../componets/textInput';
import { ImageAssets } from '../../assets/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../theme/ThemeContext';
import OTPTextInput from 'react-native-otp-textinput';
import { useAppNavigation } from '../../utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp, setOtpSent } from '../../redux/slices/authSlice';
import { showToast } from '../../redux/slices/toastSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { screenHeight } from '../../utils/screenSize';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { goToPersonalDetails } = useAppNavigation();

  const dispatch = useDispatch();
  const { loading, error, otpSent, user } = useSelector((state: any) => state.auth);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');


  const handleSendOtp = async () => {
    const trimmedPhone = phone?.trim();
    if (!trimmedPhone) {
      dispatch(showToast({ message: "Phone number is required", type: "error" }));
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      dispatch(showToast({ message: "Invalid phone number", type: "error" }));
      return;
    }

    try {
      await dispatch(sendOtp(trimmedPhone)).unwrap();
      dispatch(showToast({ message: "OTP sent successfully", type: "success" }));
    } catch (err) {
      dispatch(showToast({ message: "Failed to send OTP", type: "error" }));
    }
  };


  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      return dispatch(showToast({ message: "OTP is required", type: "error" }));
    }

    try {
      let result = await dispatch(verifyOtp({ phone, otp })).unwrap();
      console.log(result)
      AsyncStorage.setItem("token", result.data.token)
      dispatch(showToast({ message: "OTP verified successfully", type: "success" }));
      goToPersonalDetails()
    } catch (err) {
      dispatch(showToast({ message: err || "Invalid OTP", type: "error" }));
    }
  };


  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background, height: screenHeight }]}>
        {/* Top Banner */}
        <Image
          source={ImageAssets.loginBanner}
          style={styles.banner}
          resizeMode="cover"
        />

        <View style={{ paddingHorizontal: 20 }}>
          {/* Title and Subtitle */}
          <Text style={[styles.title, { color: colors.text }]}>India’s #1 Food Delivery ziptom App</Text>
          <Text style={styles.subtitle}>Log in or sign up</Text>

          {/* Phone Input Row */}
          <View style={[styles.phoneRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.countryCode, { color: colors.text }]}>+91</Text>
            <View style={{ flex: 1 }}>
              <AppTextInput
                placeholder="Enter Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.phoneInput}
                maxLength={10}
              />
            </View>
            {/* Continue Button */}
            {loading ?
              <ActivityIndicator /> :

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleSendOtp}
              >
                <MaterialIcons name="arrow-forward" size={24} color={colors.background} />
              </TouchableOpacity>
            }
          </View>

          {/* OR Divider */}
          <Text style={styles.or}>or</Text>

          {/* Social Login */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: colors.primary }]}>
              <FontAwesome name="google" size={24} color={colors.background} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: colors.primary }]}>
              <FontAwesome name="facebook" size={24} color={colors.background} />
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          <Text style={[styles.terms, { color: colors.text }]}>
            By continuing, you agree to our{' '}
            <Text style={[styles.link, { color: colors.primary }]}>Terms of Service </Text>
            {`${' '}`}
            <Text style={[styles.link, { color: colors.primary }]}> Privacy Policy</Text>
            {`${' '}`}
            <Text style={[styles.link, { color: colors.primary }]}>Content Policy</Text>
          </Text>
        </View>

        {/* OTP Modal */}
        <Modal
          visible={otpSent}
          transparent
          animationType="slide"
          onRequestClose={() => dispatch({ type: 'CLOSE_OTP_MODAL' })}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Enter OTP</Text>
              <OTPTextInput
                handleTextChange={setOtp}
                inputCount={4}
                tintColor={colors.primary}
                offTintColor={colors.border}
                containerStyle={{ alignSelf: 'center' }}
                textInputStyle={{ color: colors.text, borderRadius: 8, borderWidth: 1, borderColor: colors.primary }}
              />
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary, marginTop: 16 }]}
                onPress={handleVerifyOtp}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch(setOtpSent(false))} style={{ marginTop: 10 }}>
                <Text style={{ color: colors.primary, textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { width: '100%', height: '40%', marginBottom: 16, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, marginTop: 20 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 20 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  flag: { width: 28, height: 20, marginRight: 8 },
  countryCode: { fontSize: 16, marginRight: 8, color: '#222' },
  phoneInput: { borderWidth: 0, backgroundColor: 'transparent', paddingLeft: 0 },
  button: {
    backgroundColor: '#FF3366',
    borderRadius: 360,
    alignItems: 'center',
    padding: 10
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  or: { textAlign: 'center', color: '#888', marginVertical: 10 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  socialIcon: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconImg: { width: 28, height: 28 },
  terms: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 10 },
  link: { color: '#FF3366', textDecorationLine: 'underline' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  otpInput: {
    width: '100%',
    textAlign: 'center'
  }
});

export default LoginScreen;