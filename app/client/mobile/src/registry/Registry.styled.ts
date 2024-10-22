import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  registry: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    width: '100%',
  },
  close: {
    flexShrink: 0,
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 3,
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    height: 40,
    maxHeight: 40,
    borderRadius: 8,
  },
  divider: {
    width: '100%',
    height: 2,
  },
  inputServer: {
    flexGrow: 2,
    flex: 2,
    height: 40,
    marginRight: 8,
    marginLeft: 4,
    display: 'flex',
  },
  inputUsername: {
    flexGrow: 2,
    flex: 2,
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
});
