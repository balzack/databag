import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
  },
  overlay: {
    marginRight: 16,
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 2,
    borderTopLeftRadius: 4,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 4,
    backgroundColor: Colors.lightgrey,
    padding: 8,
    margin: 16,
  },
})

