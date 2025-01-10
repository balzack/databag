import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  conversation: {
    flex: 1
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  carousel: {
    paddingLeft: 8,
    paddingBottom: 8,
    height: 80,
  },
  status: {
    width: 40,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  assets: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  modal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorArea: {
    position: 'relative',
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    padding: 16,
    borderRadius: 8,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  messageList: {
    width: '100%',
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
    opacity: 0.5,
  },
  loading: {
    position: 'absolute',
    opacity: 0.3,
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
  icon: {
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
  progress: {
    height: 1,
    position: 'absolute',
    width: '50%',
    backgroundColor: Colors.primary,
  },
  header: {
    display: 'flex',
    width: '100%',
    minWidth: 0,
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    gap: 8,
  },
  label: {
    fontSize: 24,
    minWidth: 0,
    flexShrink: 1,
  },
  add: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 8,
    paddingBottom: 8,
  },
  message: {
    width: '100%',
    fontSize: 14,
    padding: 0,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
  },
  control: {
    borderRadius: 4,
  },
  surface: {
    borderRadius: 4,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    color: Colors.primary,
  },
  end: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  separator: {
    width: 1,
    height: '100%',
  }
});
