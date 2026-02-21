import { PropsWithChildren, useEffect } from "react";
import { AppState, Platform } from "react-native";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tiempo que los datos se consideran frescos
            staleTime: 10_000,
            // Siempre refetch al montar el componente
            refetchOnMount: 'always',
            // Refetch al recuperar el foco de la ventana
            refetchOnWindowFocus: true,
            // Reintentar 3 veces con delays más cortos
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
            // Cache de 5 minutos
            gcTime: 5 * 60 * 1000,
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
