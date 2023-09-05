import { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { DisplayContext } from 'context/DisplayContext';
import { BlurView } from "@react-native-community/blur";
import { styles } from './Prompt.styled';
import { Colors } from 'constants/Colors';

export function Prompt() {
  const display = useContext(DisplayContext);

  const okModal = () => {
    if (display.state.modalOk.action) {
      display.state.modalOk.action();
    }
    display.actions.hideModal();
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={display.state.modal}
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={display.actions.hideModal}
    >
      <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>{ display.state.modalTitle }</Text>
          <View style={styles.modalButtons}>
            { display.state.modalCancel && (
              <TouchableOpacity style={styles.cancelButton} activeOpacity={1} onPress={display.actions.hideModal}>
                <Text style={styles.cancelButtonText}>{ display.state.modalCancel.label }</Text>
              </TouchableOpacity>
            )}
            { display.state.modalOk && (
              <TouchableOpacity style={styles.okButton} activeOpacity={1} onPress={okModal}>
                <Text style={styles.okButtonText}>{ display.state.modalOk.label }</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

