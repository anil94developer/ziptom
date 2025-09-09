import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import AppTextInput from '../../componets/textInput';
import { ImageAssets } from '../../assets/images';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <Image
        source={ImageAssets.loginBanner} // Add your banner image here
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={{ paddingHorizontal: 20 }}>
        {/* Title and Subtitle */}
        <Text style={styles.title}>India’s #1 Food Delivery ZIPTOM App</Text>
        <Text style={styles.subtitle}>Log in or sign up</Text>

        {/* Phone Input Row */}
        <View style={styles.phoneRow}>
          <Image
            source={ImageAssets.Logo} // Add your flag image here
            style={styles.flag}
          />
          <Text style={styles.countryCode}>+91</Text>
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
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <Text style={styles.or}>or</Text>

        {/* Social Login */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Image source={ImageAssets.Logo} style={styles.iconImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Image source={ImageAssets.Logo} style={styles.iconImg} />
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> <Text style={styles.link}>Privacy Policy</Text> <Text style={styles.link}>Content Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { width: '100%', height: 280, marginBottom: 16, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
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
    height: 48,
  },
  flag: { width: 28, height: 20, marginRight: 8 },
  countryCode: { fontSize: 16, marginRight: 8, color: '#222' },
  phoneInput: { borderWidth: 0, backgroundColor: 'transparent', paddingLeft: 0 },
  button: {
    backgroundColor: '#FF3366',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
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
  },
  iconImg: { width: 28, height: 28 },
  terms: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 10 },
  link: { color: '#FF3366', textDecorationLine: 'underline' },
});

export default LoginScreen;