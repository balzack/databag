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
  split: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  right: {
    flex: 1,
    height: '100%',
    overflow: 'scroll',
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
    minHeight: '650',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  input: {
    width: '50%',
    margin: 4,
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
    width: '20%',
    minWidth: 'fit-content',
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
