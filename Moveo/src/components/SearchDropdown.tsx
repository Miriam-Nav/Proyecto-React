import React, { useState, useRef } from "react";
import { View, FlatList, TouchableOpacity, Keyboard } from "react-native";
import { useTheme, TextInput as PaperInput, Text, Portal } from "react-native-paper";
import { formStyles } from "../styles/form.styles";

interface Props<T> {
  label: string;
  value: number | null;
  onChange: (id: number | null) => void;
  items: T[];
  getLabel: (item: T) => string;
  keyExtractor: (item: T) => string;
  renderItem?: (item: T) => React.ReactNode;
}

export function SearchDropdown<T extends { id: number }>({
  label,
  value,
  onChange,
  items,
  getLabel,
  keyExtractor,
  renderItem,
}: Props<T>) {
  const theme = useTheme();
  const formS = formStyles(theme);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const inputRef = useRef<View>(null);

  const selectedItem = items.find((i) => i.id === value);
  const filtered = items.filter((i) =>
    getLabel(i).toLowerCase().includes(query.toLowerCase())
  );

  const medirYAbrir = () => {
    inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
      setOpen(true);
    });
  };

  return (
    <View style={{ marginBottom: 15 }} ref={inputRef} collapsable={false}>
      <PaperInput
        label={label}
        // Mantenemos el texto de búsqueda mientras está abierto para que no salte el teclado
        value={open ? query : (selectedItem ? getLabel(selectedItem) : "")}
        onChangeText={(text) => {
          setQuery(text);
          if (!open) medirYAbrir();
          if (value !== null) onChange(null);
        }}
        onFocus={medirYAbrir}
        mode="outlined"
        style={formS.input}
        outlineStyle={formS.inputOutline}
        contentStyle={formS.inputContent}
        right={
          <PaperInput.Icon 
            icon={value ? "close" : (open ? "chevron-up" : "chevron-down")} 
            onPress={() => {
              if (value) {
                onChange(null);
                setQuery("");
              } else {
                open ? setOpen(false) : medirYAbrir();
              }
            }}
          />
        }
      />

      <Portal>
        {open && (
          <>
            {/* Fondo invisible para cerrar al tocar fuera sin romper el foco */}
            <TouchableOpacity 
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} 
              activeOpacity={1} 
              onPress={() => setOpen(false)} 
            />
            
            <View
              style={{
                position: "absolute",
                top: layout.y + layout.height,
                left: layout.x,
                width: layout.width,
                maxHeight: 200,
                backgroundColor: theme.colors.surface,
                borderRadius: 10,
                borderWidth: 3,
                borderColor: theme.colors.outlineVariant,
                elevation: 10,
                zIndex: 9999,
                overflow: "hidden",
              }}
            >
              <FlatList
                data={filtered}
                keyExtractor={keyExtractor}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(item.id);
                      setQuery("");
                      setOpen(false);
                      Keyboard.dismiss();
                    }}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.surfaceVariant,
                    }}
                  >
                    {renderItem ? renderItem(item) : (
                      <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                        {getLabel(item)}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        )}
      </Portal>
    </View>
  );
}