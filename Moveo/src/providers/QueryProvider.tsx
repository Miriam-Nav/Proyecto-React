import { PropsWithChildren, useEffect } from "react";
import { AppState, Platform } from "react-native";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
        },
    },
});

export function QueryProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        if (Platform.OS === "web") return;
        const subscription = AppState.addEventListener("change", (status) => {
            focusManager.setFocused(status === "active");
        });
        return () => subscription.remove();
    }, []);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
