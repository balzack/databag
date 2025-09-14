import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    paddingTop: '20%',
    paddingBottom: '10%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 8,
    opacity: 0.2,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
  },
  label: {
    fontSize: 18,
    fontWeight: 600,
  },
  image: {
    width: '70%',
    height: '50%',
    opacity: 0.2,
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
  status: {
    height: 64,
    opactiy: 0.5,
  },
});
