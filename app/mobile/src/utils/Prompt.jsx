import { useContext, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { DisplayContext } from 'context/DisplayContext';
import { styles } from './Prompt.styled';
import { Colors } from 'constants/Colors';

export function Prompt() {
  const display = useContext(DisplayContext);
  const [busy, setBusy] = useState(false);

  const okPrompt = async () => {
    if (!busy) {
      const { action, failed } = display.state.prompt?.ok || {};
      if (action) {
        setBusy(true);
        try {
          await action();
          display.actions.hidePrompt();
        }
        catch (err) {
          if (failed) {
            failed();
          }
        }
        setBusy(false);
      }
      else {
        display.actions.hidePrompt();
      }
    }
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={display.state.prompt != null}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={display.actions.hidePrompt}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blur} />
          <View style={styles.modalBase}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>{ display.state.prompt?.title }</Text>
              <View style={display.state.prompt?.centerButtons ? styles.centerModalButtons : styles.modalButtons}>
                { display.state.prompt?.cancel && (
                  <TouchableOpacity style={styles.cancelButton} activeOpacity={1} onPress={display.actions.hidePrompt}>
                    <Text style={styles.cancelButtonText}>{ display.state.prompt?.cancel?.label }</Text>
                  </TouchableOpacity>
                )}
                { display.state.prompt?.ok && (
                  <TouchableOpacity style={styles.okButton} activeOpacity={1} onPress={okPrompt}>
                    { !busy && (
                      <Text style={styles.okButtonText}>{ display.state.prompt?.ok?.label }</Text>
                    )}
                    { busy && (
                      <ActivityIndicator animating={true} color={Colors.primaryButtonText} />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={display.state.alert != null}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={display.actions.hideAlert}
      >
        <View styles={styles.blur} />
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>{ display.state.alert?.title }</Text>
            <Text style={styles.modalMessage}>{ display.state.alert?.message }</Text>
            <TouchableOpacity style={styles.okButton} activeOpacity={1} onPress={display.actions.hideAlert}>
              <Text style={styles.okButtonText}>{ display.state.alert?.ok }</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}

