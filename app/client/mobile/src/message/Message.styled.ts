import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  message: {
    width: '100%',
  },
  component: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  menuContent: {
    borderRadius: 8,
  },
  inputBorder: {
    borderRadius: 12,
    borderWidth: 0,
  },
  topic: {
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: 8,
  },
  pad: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  longbone: {
    width: '100%',
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.placeholder,
    marginTop: 8,
  },
  shortbone: {
    width: '50%',
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.placeholder,
    marginTop: 8,
  },
  menuOption: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 16,
    gap: 8,
  },
  smDot: {
    width: 64,
    height: 64,
    backgroundColor: Colors.placeholder,
    margin: 8,
    borderRadius: 16,
  },
  lgDot: {
    width: 64,
    height: 64,
    backgroundColor: Colors.placeholder,
    marginLeft: 48,
    borderRadius: 16,
  },
  dot: {
    width: 64,
    height: 64,
    backgroundColor: Colors.placeholder,
    marginLeft: 56,
    marginBottom: 18,
    borderRadius: 16,
  },
  error: {
    marginLeft: 52,
    marginTop: 8,
    marginBottom: 16,
    color: Colors.offsync,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 2,
    marginLeft: 8,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    lineHeight: 16,
    gap: 16,
    position: 'relative',
  },
  name: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  labelName: {
    fontWeight: 700,
    fontSize: 16,
  },
  labelHandle: {
    fontSize: 16,
  },
  labelUnknown: {
    fontSize: 16,
  },
  handle: {
    fontSize: 14,
  },
  unknown: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  locked: {
    fontStyle: 'italic',
    color: Colors.placeholder,
  },
  text: {
    fontSize: 16,
    minWidth: 0,
  },
  timestamp: {
    fontSize: 12,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 8,
  },
  option: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  padding: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 4,
  },
  carousel: {
    paddingLeft: 40,
    paddingBottom: 16,
  },
  assets: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
  },
  item: {
    width: 64,
    height: 64,
    backgroundColor: 'yellow',
  },
  modal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editArea: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    maxWidth: 500,
    padding: 16,
    borderRadius: 8,
  },
  editContent: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    gap: 16,
  },
  menu: {
    borderRadius: 8,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    paddingLeft: 8,
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    gap: 8,
  },
  control: {
    flex: 1,
    borderRadius: 8,
  },
  border: {
    width: '100%',
    height: 1,
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
    alignItems: 'center',
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  messageContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
    paddingBottom: 16,
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 1,
    minWidth: 0,
  },
  messageSurface: {
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  messageText: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  shimmerContainer: {
    padding: 16,
  },
  mediaScroll: {
    paddingTop: 12,
  },
  lockedText: {
    padding: 16,
  },
  linkText: {
    fontStyle: 'italic',
  },
  messageContainerReverse: {
    flexDirection: 'row-reverse',
  },
  messageContainerNormal: {
    flexDirection: 'row',
  },
});
