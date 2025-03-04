import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  avoid: {
    flex: 1,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  mfa: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mfaTitle: {
    fontSize: '1.5rem',
  },
  mfaPin: {
    paddingTop: 32,
  },
  mfaDescription: {
    fontSize: '1.1rem',
  },
  mfaControl: {
    display: 'flex',
    gap: 8,
  },
  mfaDisabled: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    color: 'red',
  },
  label: {
    flexGrow: 1,
    textAlign: 'center',
    paddingTop: 64,
  },
  admin: {
    width: 64,
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  split: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  right: {
    flex: 1,
    height: '100%',
  },
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: '100%',
    backgroundColor: '#90bea7',
  },
  frame: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    maxWidth: 300,
    width: '80%',
    margin: 4,
    marginTop: 16,
  },
  spacer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: 76,
  },
  hidden: {
    width: '50%',
    margin: 4,
    opacity: 0,
    zIndex: -10,
  },
  title: {
    position: 'absolute',
    top: 0,
    margin: 64,
  },
  submit: {
    marginTop: 16,
    marginBottom: 8,
    width: 'auto',
  },
  float: {
    position: 'absolute',
    right: 0,
    top: 0,
    marginTop: 8,
  },
  settings: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    position: 'absolute',
    margin: 16,
    bottom: 0,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    width: 300,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  close: {
    paddingTop: 8,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  terms: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accept: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSurface: {
    width: '100%',
    height: '100%',
    paddingBottom: 64,
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    flexGrow: 1,
    fontSize: 20,
    paddingLeft: 16,
  },
  modalClose: {
    backgroundColor: 'transparent',
  },
  frame: {
    minHeight: 0,
    flexGrow: 1,
  },
  line: {
    width: '100%',
  },
});
