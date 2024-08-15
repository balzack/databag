import {
  StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 24,
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
    marginTop: 32,
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
})
