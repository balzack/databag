import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

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
    width: '33%',
    maxWidth: 300,
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
  identity: {
    flexShrink: 0,
    paddingBottom: 4,
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
});
