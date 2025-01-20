import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

export const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  image: {
  },
  thumb: {
    borderRadius: 4,
  },
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  close: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  spacer: {
    flexGrow: 1,
  },
  closeIcon: {
    borderRadius: 8,
    opacity: 0.7,
  },
  progress: {
    position: 'absolute',
    bottom: '10%',
    width: '50%',
  },
  alert: {
    position: 'absolute',
    bottom: '10%'
  },
  alert: {
    position: 'absolute',
    bottom: 0,
  },
  alertLabel: {
    color: Colors.offsync,
  },
});
