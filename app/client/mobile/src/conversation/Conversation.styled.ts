import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  conversation: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
  },
  messages: {
    paddingBottom: 64,
  },
  thread: {
    display: 'flex',
    flexGrow: 1,
    minHeight: 0,
    height: '50%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  more: {
    paddingTop: 16,
    position: 'absolute',
    top: 0,
  },
  loading: {
    position: 'absolute',
  },
  empty: {
    position: 'absolute',
    fontSize: 20,
    color: Colors.placeholder,
  },
  add: {
    height: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    flexShrink: 0,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  border: {
    width: '100%',
    height: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconSpace: {
    width: '10%',
  },
  title: {
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
  }
});
