import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useTheme, TextInput as PaperInput } from "react-native-paper";

// Hook 

export function useSearchDropdown<T extends { id: number }>(getLabel: (item: T) => string) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const select = useCallback((item: T) => {
    setSelectedId(item.id);
    setQuery(getLabel(item));
    setOpen(false);
  }, [getLabel]);

  const clear = useCallback(() => {
    setSelectedId(null);
    setQuery("");
  }, []);

  return { selectedId, query, setQuery, open, setOpen, select, clear };
}

// Componente 

interface SearchDropdownProps<T> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  dropdownVisible: boolean;
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onSelectItem: (item: T) => void;
  zIndex?: number;
}

export function SearchDropdown<T>({
  label,
  value,
  onChangeText,
  onFocus,
  dropdownVisible,
  items,
  keyExtractor,
  renderItem,
  onSelectItem,
  zIndex = 1,
}: SearchDropdownProps<T>) {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: 20, position: "relative", zIndex }}>
      <PaperInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        mode="outlined"
        style={{ fontFamily: "monospace", fontSize: 13 }}
        right={
          <PaperInput.Icon icon={dropdownVisible ? "chevron-up" : "chevron-down"} />
        }
      />
      {dropdownVisible && items.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            right: 0,
            maxHeight: 220,
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <FlatList
            data={items}
            keyExtractor={keyExtractor}
            style={{
              maxHeight: 220,
              backgroundColor: theme.colors.surface,
            }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelectItem(item)}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.surfaceVariant,
                  backgroundColor: theme.colors.surface,
                }}
              >
                {renderItem(item)}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}