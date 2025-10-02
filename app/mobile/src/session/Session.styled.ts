import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  session: {
    position: 'relative',
  },
  container: {
    width: '100%',
    height: '100%',
  },
  noHeader: {
    headerBackTitleVisible: false,
  },
  full: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  show: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  onboard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  alert: {
    position: 'absolute',
    top: '33%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  alertArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
  },
  alertLabel: {
    color: Colors.offsync,
    padding: 0,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 16,
  },
  frame: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '40%',
    maxWidth: 450,
  },
  right: {
    height: '100%',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  workarea: {
    height: '100%',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  focus: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  identity: {
    flexShrink: 0,
    borderBottomWidth: 1,
  },
  channels: {
    flexGrow: 1,
    height: 1,
  },
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
  tabs: {
    flexShrink: 0,
    height: 64,
    width: '100%',
    displlay: 'flex',
    flexDirection: 'row',
  },
  idleTab: {
    flex: 1,
    backgroundColor: 'transparent',
    opacity: 0.5,
  },
  activeTab: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  ring: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  base: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tabContainer: {
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  tabWrapper: {
    overflow: 'hidden',
    position: 'relative',
    height: 96,
    width: '100%',
  },
  tabBar: {
    height: 96,
  },
  hidden: {
    zIndex: 0,
  },
  visible: {
    zIndex: 1,
  },
});
