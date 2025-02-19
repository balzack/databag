import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  accounts: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  largeTitle: {
    fontSize: 20,
    flexGrow: 1,
    paddingLeft: 16,
  },
  smallTitle: {
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
  members: {
    width: '100%',
    flexGrow: 1,
  },
  empty: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: Colors.placeholder,
  },
  card: {
    width: '100%',
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  modalSurface: {
    padding: 16,
    borderRadius: 8,
  },
  modal: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  modalLabel: {
    fontSize: 20,
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  modalDescription: {
    paddingTop: 16,
  },
  secretText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  secret: {
    paddingRight: 16,
    fontSize: 20,
  },
  secretIcon: {
    marginLeft: 8,
  },
  modalControls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
