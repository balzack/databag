import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  body: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.formBackground,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  firstRun: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splash: {
    width: '100%',
    height: '100%',
    maxWidth: '80%',
    maxHeight: '50%',
  },
  steps: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  step: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  titleText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  tagText: {
    paddingTop: 8,
    color: Colors.white,
    fontSize: 16,
  },
  title: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    color: Colors.white,
    paddingLeft: 16,
    fontSize: 16,
  },
  start: {
    marginTop: 16,
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
  },
  startText: {
    color: Colors.white,
  },
  tabBar: {
    backgroundColor: Colors.primary,
  },
  home: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '33%',
    maxWidth: 500,
    borderRightWidth: 1,
    borderColor: Colors.divider,
  },
  conversation: {
    width: '67%',
    backgroundColor: Colors.formFocus,
  },
  drawer: {
    width: '100%',
    height: '100%',
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: Colors.formBackground,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 4,
    paddingRight: 8,
  },
  option: {
    width: '50%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    paddingRight: 8,
  },
  channels: {
    flexGrow: 1,
    flexShrink: 1,
    position: 'relative',
  },
  tabframe: {
    width: '100%',
    height: '100%',
  },
  disconnected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.alert,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  profileLabel: {
    paddingLeft: 8,
  },
});
