import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  config: {
    paddingTop: 8,
  },
  icon: {
    padding: 8,
  },
  space: {
    width: 32,
  },
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.formBackground,
    borderRadius: 4,
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingLeft: 16,
    paddingRight: 16,
    },
  control: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: Colors.grey,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    color: Colors.grey,
  },
  spacemid: {
    flexGrow: 1,
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  spacetop: {
    flexGrow: 1,
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  header: {
    fontSize: 32,
    color: Colors.text,
  },
  inputwrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 4,
    borderColor: Colors.divider,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  inputfield: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
  },
  reset: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  resettext: {
    color: Colors.formFocus,
  },
  noreset: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    borderRadius: 4,
    borderColor: Colors.divider,
    borderWidth: 1,
  },
  noresettext: {
    color: Colors.grey,
  },
  login: {
    marginTop: 16,
  },
  logintext: {
    fontColor: 'yellow',
  },
  nologintext: {
    color: Colors.disabled,
  },
    
})

