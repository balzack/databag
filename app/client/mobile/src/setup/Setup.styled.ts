import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  setup: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  title: {
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
  form: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
    height: 100,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
});
