import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
    backgroundColor: Colors.grey,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 8,
    paddingLeft: 48,
    paddingRight: 48,
    color: Colors.white,
  },
  action: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copied: {
    height: 32,
    paddingTop: 8,
  },
  copiedText: {
    color: Colors.white,
    fontSize: 18,
  },
  extension: {
    textAlign: 'center',
    fontSize: 48,
    paddingBottom: 8,
    paddingLeft: 48,
    paddingRight: 48,
    color: Colors.white,
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
  decrypting: {
    fontVariant: ["tabular-nums"],
    paddingTop: 16,
    fontSize: 12,
    color: '#888888',
  },
})

