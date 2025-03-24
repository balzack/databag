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
  button: {
    position: 'absolute',
    borderRadius: 4,
  },
  control: {
    backgroundColor: 'transparent',
  },
  container: {
    position: 'relative',
    width: 92,
    height: 92,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    fontSize: 12,
    position: 'absolute',
    top: 0,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  binary: {
    position: 'relative',
  },
  thumb: {
    borderRadius: 4,
    width: 92,
    height: 92,
  },
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  label: {
    flexGrow: 1,
    fontSize: 32,
    paddingLeft: 16,
    minWidth: 0,
    textOverflow: 'ellipsis',
    flexShrink: 1,
  },
  close: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    top: 0,
    minWidth: 0,
    width: '100%',
  },
  alert: {
    position: 'absolute',
    bottom: 0,
  },
  alertLabel: {
    color: Colors.offsync,
  },
  closeIcon: {},
  progress: {
    position: 'absolute',
    bottom: '10%',
    width: '50%',
  },
});
