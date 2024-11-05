import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    flexGrow: 1,
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1,
    height: 1,
  },
  bar: {
    flexShrink: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 6,
    fontSize: 16,
  },
  indicator: {
    borderRightWidth: 2,
  },
  header: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
    paddingLeft: 8,
    width: '100%',
    zIndex: 1,
  },
  sort: {
    borderRadius: 4,
  },
  divider: {
    width: '100%',
    height: 2,
  },
  inputSurface: {
    flexGrow: 1,
    height: 40,
    marginRight: 8,
    marginLeft: 4,
    display: 'flex',
  },
  input: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    height: 40,
    maxHeight: 40,
    borderRadius: 8,
  },
  inputUnderline: {
    display: 'none',
  },
  icon: {
    backgroundColor: 'transparent',
  },
  none: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noneLabel: {
    fontSize: 20,
    color: Colors.placeholder,
  },
  channels: {
    width: '100%',
  },
  channel: {
    width: '100%',
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
  unread: {
    borderRightWidth: 2,
    borderColor: Colors.unread,
    borderRadius: 8,
  },
  read: {
  },
});
