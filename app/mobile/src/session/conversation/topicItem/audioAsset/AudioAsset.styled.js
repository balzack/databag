import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
    backgroundColor: Colors.formBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  control: {
    position: 'absolute',
    paddingRight: 8,
    paddingTop: 4,
  },
  label: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 8,
    top: 0,
    paddingLeft: 48,
    paddingRight: 48,
    color: Colors.text,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  player: {
    display: 'none',
  },
})

