import React, { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useTheme, TextInput as PaperInput, Text } from "react-native-paper";

interface Props<T> {
  label: string;
  value: number | null;                
  onChange: (id: number) => void;      
  items: T[];
  getLabel: (item: T) => string;       
  keyExtractor: (item: T) => string;
  renderItem?: (item: T) => React.ReactNode;
  zIndex?: number;
}

export function SearchDropdown<T extends { id: number }>({
  label,
  value,
  onChange,
  items,
  getLabel,
  keyExtractor,
  renderItem,
  zIndex = 1,
}: Props<T>) {
  const theme = useTheme();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedItem = items.find((i) => i.id === value);

  const filtered = items.filter((i) =>
    getLabel(i).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={{ marginBottom: 20, position: "relative", zIndex }}>
      <PaperInput
        label={label}
        value={selectedItem ? getLabel(selectedItem) : query}
        onChangeText={(text) => {
          setQuery(text);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        mode="outlined"
        right={
          <PaperInput.Icon icon={open ? "chevron-up" : "chevron-down"} />
        }
      />

      {open && filtered.length > 0 && (
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
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          <FlatList
            data={filtered}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onChange(item.id);      
                  setQuery(getLabel(item));
                  setOpen(false);
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.surfaceVariant,
                }}
              >
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <Text>{getLabel(item)}</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
