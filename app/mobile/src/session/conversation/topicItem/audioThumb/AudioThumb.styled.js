import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/Colors';

export const styles = StyleSheet.create({
  overlay: {
    top: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    paddingRight: 16,
    maxHeight: 50,
  },
  label: {
    textAlign: 'center',
    color: Colors.text,
    padding: 4,
    fontSize: 12,
  },
})

