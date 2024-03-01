// import React, { useState } from 'react';
import { Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';

function PhoneSignIn() {
    const [code, setCode] = useState('');
    const [confirm, setConfirm] = useState(null);

    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    }

    async function confirmCode() {
        try {
            await confirm.confirm(code);
        } catch (error) {
            console.error('Invalid code:', error);
        }
    }

    if (!confirm) {
        return <Button title="Phone Number Sign In" onPress={() => signInWithPhoneNumber('+917892446715')} />;
    }

    return (
        <>
            <TextInput value={code} onChangeText={setCode} />
            <Button title="Confirm Code" onPress={confirmCode} />
        </>
    );
}

export default PhoneSignIn;
