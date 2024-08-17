import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/Colors';

export const styles = StyleSheet.create({
  binary: {
    width: 92,
    height: 92,
    backgroundColor: '#888888',
    borderRadius: 4,
    marginRight: 16,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    maxHeight: 50,
    textAlign: 'center',
    padding: 4,
    color: 'white',
  },
  extension: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  label: {
    color: 'white',
    fontSize: 24,
  },
})
