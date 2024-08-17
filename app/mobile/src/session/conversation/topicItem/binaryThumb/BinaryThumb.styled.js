import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/Colors';

export const styles = StyleSheet.create({
  canvas: {
    borderRadius: 4,
    width: 92,
    height: 92,
    marginRight: 16,
    backgroundColor: Colors.grey,
    display: 'flex',
    alignItems: 'center',
  },
  action: {
    flexGrow: 1,
  },
  label: {
    textAlign: 'center',
    color: Colors.white,
    padding: 4,
    fontSize: 14,
  },
  extension: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 18,
  }
})

