import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
    backgroundColor: Colors.lightgrey,
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
  share: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  close: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  player: {
    display: 'none',
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
    color: '#888888',
  },
})

