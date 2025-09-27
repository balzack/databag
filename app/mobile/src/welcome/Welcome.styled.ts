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
    height: 192,
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
    paddingTop: '10%',
    paddingBottom: '10%',
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
  detail: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  headline: {
    textAlign: 'center',
    paddingTop: 16,
    paddingLeft: 48,
    paddingRight: 48,
  },
  title: {
    textAlign: 'center',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  step: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  start: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  submit: {
    borderRadius: 8,
  },
  submitLabel: {
    width: 128,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 600,
  }
});
