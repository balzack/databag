import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '50%',
    height: '50%',
    opacity: 0.4,
  },
  title: {
    fontSize: 20,
    color: Colors.label,
  },
  description: {
    fontSize: 14,
    color: Colors.label,
  },
  steps: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
  },
  step: {
    color: Colors.label,
    fontSize: 12,
  },
});
