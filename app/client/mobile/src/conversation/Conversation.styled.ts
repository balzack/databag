import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  conversation: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  messages: {
    paddingBottom: 64,
  },
  thread: {
    width: '100%',
    flexGrow: 1,
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
