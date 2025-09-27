import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  form: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  info: {
    paddingLeft: 32,
    paddingRight: 32,
    textAlign: 'center',
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
  submit: {
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
