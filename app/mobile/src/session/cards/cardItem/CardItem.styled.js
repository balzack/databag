import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
  },
  detail: {
    paddingLeft: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  space: {
    height: 64,
  },
  name: {
    color: Colors.text,
    fontSize: 14,
  },
  handle: {
    color: Colors.text,
    fontSize: 12,
  },
  connected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.connected,
  },
  requested: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.requested,
  },
  connecting: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.connecting,
  },
  offsync: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  pending: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.pending,
  },
  confirmed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.confirmed,
  },
})

