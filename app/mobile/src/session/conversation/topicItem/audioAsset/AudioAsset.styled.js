import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.lightgrey,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 8,
    top: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  control: {
    position: 'absolute',
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
})

