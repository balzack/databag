import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  profile: {
    flexDirection: 'row',
    flexShrink: 1,
    display: 'flex',
  },
  detail: {
    paddingLeft: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 1,
    flexGrow: 1,
  },
  more: {
    paddingLeft: 16,
  },
  space: {
    height: 64,
  },
  name: {
    color: Colors.text,
    fontSize: 18,
    flexShrink: 1,
  },
  handle: {
    color: Colors.text,
    fontSize: 16,
    flexShrink: 1,
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
  trigger: {
    triggerTouchable: {
      activeOpacity: 70,
      underlayColor: Colors.screenBase,
    },
  },
  options: {
    backgroundColor: Colors.areaBase,
    borderWidth: 0.2,
    borderColor: Colors.areaBorder,
  },
  option: {
    padding: 6,
    color: Colors.text,
    backgroundColor: Colors.areaBase,
    fontFamily: 'roboto',
    fontSize: 16,
    textAlign: 'center',
  },
})

