 
import React from 'react';
import { View, Text, TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface ITextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    style?: object;
}

const AppTextInput: React.FC<ITextInputProps> = ({
    label,
    error,
    style,
    ...props
}) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.container,{backgroundColor:colors.background}]}>
            {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
            <RNTextInput
                //  textAlign='center'
                placeholderTextColor={colors.text}
                
                style={[
                    styles.input,
                    error ? styles.inputError : null, 
                    { color: colors.text, fontSize: 16, backgroundColor: colors.surface,borderStyle: 'solid', borderColor: colors.border, borderWidth: 0  },

                ]}
                {...props}

            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        // marginBottom: 16,
    },
    label: {
        marginBottom: 4,
        fontSize: 14,
        color: '#333',
    },
    input: {
        padding: 2,
        justifyContent: 'center',
        alignContent: 'center',
        height: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        fontSize: 16,
        backgroundColor: '#7b0909ff',
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default AppTextInput;