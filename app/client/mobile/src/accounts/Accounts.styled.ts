import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  accounts: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  largeTitle: {
    fontSize: 20,
    flexGrow: 1,
    paddingLeft: 16,
  },
  smallTitle: {
    fontSize: 20,
    textAlign: 'center',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 48,
  },
  line: {
    width: '100%',
  },
  members: {
    width: '100%',
    flexGrow: 1,
  },
  empty: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: Colors.placeholder,
  },
  card: {
    width: '100%',
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});
