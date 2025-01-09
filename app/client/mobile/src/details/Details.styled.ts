import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
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
    height: 48,
  },
  title: {
    fontSize: 20,
    flexGrow: 1,
    textAlign: 'center',
  },
  close: {
    width: 32,
  },
  closeIcon: {
    flexShrink: 0,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  divider: {
    width: '100%',
    height: 2,
  },
  info: {
    width: '80%',
  },
  subject: {
    width: '100%',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 4,
    marginTop: 16,
    borderRadius: 8,
  },
  input: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  underline: {
    display: 'none',
  },
  icon: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  inputControl: {
    width: 32,
    height: 32,
    backgroundColor: 'yellow',
  },
  members: {
    flexGrow: 1,
  },
});
