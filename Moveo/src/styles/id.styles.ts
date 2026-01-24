import { StyleSheet } from "react-native"; 

export const idStyles = (theme) => StyleSheet.create({

  /* HEADER */
  header: {
    alignItems: "center",
    padding: 40,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.outlineVariant,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: theme.colors.outlineVariant,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.onPrimary,
    fontFamily: "monospace",
  },
  headerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.onSurface,
    fontFamily: "monospace",
    marginBottom: 10,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: theme.colors.onPrimary,
    fontWeight: "bold",
    fontFamily: "monospace",
  },

  /* INFO CARDS */
  infoCard: {
    flexDirection: "column",
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: theme.colors.outlineVariant,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    paddingBottom: 5,
    color: theme.colors.outline,
    fontFamily: "monospace",
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontFamily: "monospace",
    fontWeight: "600",
  },

  /* PEDIDOS */
  emptyPedidosText: {
    color: theme.colors.outline,
    fontFamily: "monospace",
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  pedidoCodigo: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: theme.colors.onSurface,
  },
  pedidoEstadoBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary,
  },
  pedidoEstadoText: {
    color: theme.colors.onSecondary,
    fontWeight: "bold",
    fontSize: 11,
    fontFamily: "monospace",
  },
  pedidoFecha: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    fontFamily: "monospace",
  },
});