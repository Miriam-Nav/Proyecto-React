import { useState } from 'react';
import { Portal, Dialog, Button, useTheme, Text } from 'react-native-paper';
import { commonStyles } from '../styles/common.styles';

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
};

export function useConfirmDialog() {
  const [visible, setVisible] = useState(false);
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps | null>(null);
  const theme = useTheme();

  const show = (props: ConfirmDialogProps) => {
    setDialogProps(props);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const handleConfirm = async () => {
    if (dialogProps?.onConfirm) {
      await dialogProps.onConfirm();
    }
    hide();
  };

  const ConfirmDialog = () => (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={hide}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Dialog.Title style={{ fontFamily: 'monospace' }}>
          {dialogProps?.title}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ fontFamily: 'monospace', color: theme.colors.onSurface }}>
            {dialogProps?.message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            onPress={hide}
            textColor={theme.colors.onSurfaceVariant}
          >
            {dialogProps?.cancelText || 'Cancelar'}
          </Button>
          <Button 
            onPress={handleConfirm}
            textColor={theme.colors.error}
          >
            {dialogProps?.confirmText || 'Confirmar'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return { show, hide, ConfirmDialog };
}
