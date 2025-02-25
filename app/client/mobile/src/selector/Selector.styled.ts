import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

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
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'relative',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
  },
  data: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  channels: {
    minHeight: 100,
    maxHeight: 400,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden'
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    paddingLeft: 16,
    fontSize: 20,
  },
  close: {
    backgroundColor: 'transparent',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-end',
    padding: 16,
  },
  empty: {
    fontSize: 18,
    color: Colors.placeholder,
  },
  control: {
    borderRadius: 4,
  },
  list: {
    width: '100%',
    height: 200,
  },
  channel: {
    width: '100%',
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
});
