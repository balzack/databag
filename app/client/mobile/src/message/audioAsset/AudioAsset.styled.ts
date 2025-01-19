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
  failed: {
    color: Colors.offsync,
  },
  control: {
    position: 'absolute',
    borderRadius: 8,
  },
  iconButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  button: {
    position: 'absolute',
    borderRadius: 4,
  },
  container: {
    position: 'relative',
    width: 92,
    height: 92,
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
  audio: {
    position: 'relative',
  },
  thumb: {
    borderRadius: 4,
    width: 92,
    height: 92,
  },
  full: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  player: {
    display: 'none',
  },
  info: {
    fontSize: 12,
    position: 'absolute',
    top: 0,
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
  closeIcon: {
    flexShrink: 0,
  },
  progress: {
    position: 'absolute',
    bottom: '10%',
    width: '50%',
  },
  alert: {
    position: 'absolute',
    bottom: 0,
  },
  alertLabel: {
    color: Colors.offsync,
  },
});
