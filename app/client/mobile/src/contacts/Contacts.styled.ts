import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  contacts: {
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
  },
  sort: {
    borderRadius: 4,
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
});
