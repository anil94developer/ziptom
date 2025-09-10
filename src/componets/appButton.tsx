import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface IAppButtonProps {
    label: string;
    onPress: () => void;
    error?: string;
    style?: object;
    disabled?: boolean;
    loading?: boolean;
}

const AppButton: React.FC<IAppButtonProps> = ({
    label,
    onPress,
    error,
    style,
    disabled = false,
    loading = false,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container]}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                style={[
                    styles.button,
                    { backgroundColor: disabled ? colors.disabled : colors.primary, borderColor: colors.border },
                    style,
                    error ? styles.buttonError : null,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={colors.text} />
                ) : (
                    <Text style={[styles.label, { color: colors.background }]}>{label}</Text>
                )}
            </TouchableOpacity>
            {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    button: {
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonError: {
        borderColor: 'red',
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
});

export default AppButton;
