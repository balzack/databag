import {Modal, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {Surface, Text, Button} from 'react-native-paper';
import {styles} from './Confirm.styled';

export type ConfirmParams = {
  title?: string;
  prompt?: string;
  cancel?: {label: string; action: () => void};
  confirm?: {label: string; action: () => Promise<void>};
};

export function Confirm({show, busy, params}) {
  return (
    <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={show} onRequestClose={params.cancel ? params.cancel.action : () => {}}>
      <View style={styles.modal}>
        <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
        <View style={styles.content}>
          <Surface elevation={5} mode="flat" style={styles.surface}>
            {params.title && <Text style={styles.title}>{params.title}</Text>}
            {params.prompt && <Text style={styles.prompt}>{params.prompt}</Text>}
            <View style={styles.controls}>
              {params.cancel && (
                <Button mode="outlined" onPress={params.cancel.action}>
                  {params.cancel.label}
                </Button>
              )}
              {params.confirm && (
                <Button mode="contained" loading={busy} onPress={params.confirm.action}>
                  {params.confirm.label}
                </Button>
              )}
            </View>
          </Surface>
        </View>
      </View>
    </Modal>
  );
}
