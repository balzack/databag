import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  control: {
    position: 'absolute',
    paddingRight: 8,
    paddingTop: 4,
  },
  thumb: {
    borderRadius: 4,
    opacity: 0.6,
  },
  main: {
    position: 'absolute',
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
  loading: {
    position: 'absolute',
    display: 'flex',
    flexAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  decrypting: {
    fontVariant: ["tabular-nums"],
    paddingTop: 16,
    fontSize: 12,
    color: '#dddddd',
  },
})

