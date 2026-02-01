import { Redirect, Stack } from "expo-router";
import { AuthContext } from "../../providers/AuthProvider";
import { useContext } from "react";

export default function ProtectedLayout() {
    const authState = useContext(AuthContext);

    if (!authState.isReady) {
        return null;
    }

    if (!authState.isLoggedIn) {
        return <Redirect href="/login" />;
    }

    return (

        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="preferences" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="(tabs)" />
        </Stack>

    );
}