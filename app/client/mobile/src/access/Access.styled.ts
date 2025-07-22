import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  splash: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  typer: {
    width: 286,
    height: 257,
  },
  mfaModal: {
    fontSize: 20,
  },
  full: {
    width: '100%',
    height: '100%',
  },
  frame: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    flexGrow: 1,
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flexGrow: 1,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 64,
    flexGrow: 1,
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headline: {
    textAlign: 'center',
    paddingTop: 16,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 20,
    fontWeight: 600,
  },
  start: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '20%',
  },
  footer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  linkline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    paddingTop: 6,
    borderBottomWidth: 1,
  },
  footline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
    flex: 1,
  },
  submit: {
    marginTop: 16,
    borderRadius: 8,
  },
  submitContent: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  blocks: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 16,
    gap: 16,
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  legal: {
    padding: 16,
  },
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
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  adminLabel: {
    fontSize: 32,
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
  },
  inputBorder: {
    borderWidth: 0,
    borderRadius: 12,
  },
  textButton: {
    textDecorationLine: 'underline',
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
    maxWidth: 400,
  },
  terms: {
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
  line: {
    width: '100%',
  },
});
