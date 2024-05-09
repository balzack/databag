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
  thumb: {
    borderRadius: 4,
    opacity: 0.3,
  },
  main: {
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  share: {
    position: 'absolute',
    opacity: 0.9,
    top: 0,
    left: 0,
    margin: 16,
    padding: 4,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
  close: {
    position: 'absolute',
    opacity: 0.9,
    top: 0,
    right: 0,
    margin: 16,
    padding: 4,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  }
})

