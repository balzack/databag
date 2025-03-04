import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  active: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  inactive: {
    display: 'none',
  },
  call: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: '10%',
    padding: 8,
    gap: 12,
    borderRadius: 8,
    opacity: 0.7,
  },
  full: {
    width: '100%',
    height: '100%',
  },
  box: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '20%',
    height: '20%',
  },
  titleView: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 92,
  },
  titleName: {
    fontSize: 24,
    paddingBottom: 32,
  },
  titleImage: {
    width: '80%',
    height: 'auto',
    aspectRatio: 1,
    borderRadius: 8,
  },
  duration: {
    paddingTop: 16,
    fontSize: 20,
  },
  logoView: {
    height: '100%',
    width: 'auto',
    aspectRatio: 1,
  },
});
