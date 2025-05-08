import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  request: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  navHeader: {
    height: 48,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitle: {
    color: 'white',
    flexGrow: 1,
    textAlign: 'center',
  },
  navIcon: {
    color: 'white',
    width: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollWrapper: {
    width: '100%',
    flexGrow: 1,
    height: 1,
  },
  scrollContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});
