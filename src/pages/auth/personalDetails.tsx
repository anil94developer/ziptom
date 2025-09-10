import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import AppTextInput from '../../componets/textInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../../componets/appButton';
import { useNavigation } from '@react-navigation/native';
import { useAppNavigation } from '../../utils/functions';

const PersonalDetails = ({ navigation }) => {
    const {goToMainApp}= useAppNavigation();
    const [name, setName] = useState('');
    const [diet, setDiet] = useState<'veg' | 'nonveg'>('veg');
    const [restaurantPref, setRestaurantPref] = useState<'all' | 'pureveg'>('all');
    const [whatsapp, setWhatsapp] = useState(false);

    return (
        <View style={styles.container}>
            {/* Header */}


            {/* Name */}
            <Text style={styles.label}>What’s your name?</Text>
            <AppTextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                style={styles.input}
                rightIcon={
                    name ? (
                        <TouchableOpacity onPress={() => setName('')}>
                            <MaterialIcons name="close" size={20} color="#888" />
                        </TouchableOpacity>
                    ) : null
                }
            />

            {/* Dietary Preference */}
            <Text style={styles.label}>What is your dietary preference?</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[
                        styles.dietBtn,
                        diet === 'veg' && styles.dietBtnActiveVeg,
                    ]}
                    onPress={() => setDiet('veg')}
                >
                    <MaterialIcons name="check-circle-outline" size={18} color="#388e3c" />
                    <Text style={[styles.dietText, { color: '#388e3c' }]}> Veg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.dietBtn,
                        diet === 'nonveg' && styles.dietBtnActiveNonVeg,
                    ]}
                    onPress={() => setDiet('nonveg')}
                >
                    <MaterialIcons name="change-history" size={18} color="#b26a00" />
                    <Text style={[styles.dietText, { color: '#b26a00' }]}> Non Veg</Text>
                </TouchableOpacity>
            </View>

            {/* Restaurant Preference */}
            <Text style={styles.label}>Where do you like to eat from?</Text>
            <TouchableOpacity
                style={[
                    styles.restaurantBtn,
                    restaurantPref === 'all' && styles.restaurantBtnActive,
                ]}
                onPress={() => setRestaurantPref('all')}
            >
                <Text style={[
                    styles.restaurantText,
                    restaurantPref === 'all' && styles.restaurantTextActive,
                ]}>
                    Veg dishes from all restaurants
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.restaurantBtn,
                    restaurantPref === 'pureveg' && styles.restaurantBtnActive,
                ]}
                onPress={() => setRestaurantPref('pureveg')}
            >
                <Text style={[
                    styles.restaurantText,
                    restaurantPref === 'pureveg' && styles.restaurantTextActive,
                ]}>
                    Pure Veg restaurants only
                </Text>
            </TouchableOpacity>

            {/* WhatsApp Updates */}
            {/* <View style={styles.whatsappRow}>
                <FontAwesome name="whatsapp" size={22} color="#25D366" />
                <Text style={styles.whatsappText}> Send me updates on WhatsApp</Text>
                <Switch
                    value={whatsapp}
                    onValueChange={setWhatsapp}
                    thumbColor={whatsapp ? "#FF3366" : "#ccc"}
                    trackColor={{ false: "#ccc", true: "#FFB6C1" }}
                />
            </View> */}

            {/* Done Button */}
            <AppButton
                label="Submit"
                onPress={() => goToMainApp()}
                error="Something went wrong"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    header: { fontSize: 22, fontWeight: 'bold', marginLeft: 12, color: '#222' },
    label: { fontSize: 16, color: '#222', marginTop: 18, marginBottom: 8 },
    input: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fafafa',
        paddingHorizontal: 14,
        fontSize: 16,
        height: 48,
        marginBottom: 8,
    },
    row: { flexDirection: 'row', marginBottom: 12 },
    dietBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 22,
        paddingVertical: 8,
        paddingHorizontal: 18,
        marginRight: 12,
        backgroundColor: '#fff',
    },
    dietBtnActiveVeg: {
        borderColor: '#388e3c',
        backgroundColor: '#e8f5e9',
    },
    dietBtnActiveNonVeg: {
        borderColor: '#b26a00',
        backgroundColor: '#fff3e0',
    },
    dietText: { fontSize: 15, marginLeft: 4 },
    restaurantBtn: {
        borderWidth: 1,
        borderColor: '#388e3c',
        borderRadius: 22,
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    restaurantBtnActive: {
        backgroundColor: '#e8f5e9',
        borderColor: '#388e3c',
    },
    restaurantText: { fontSize: 15, color: '#388e3c' },
    restaurantTextActive: { fontWeight: 'bold' },
    whatsappRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 24,
    },
    whatsappText: { fontSize: 15, marginLeft: 8, flex: 1, color: '#222' },
    doneBtn: {
        backgroundColor: '#FF3366',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    doneText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default PersonalDetails;