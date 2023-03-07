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
    width: 40,
    textAlign: 'center',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreeterms: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
  },
  agreetermstext: {
    color: Colors.primary,
    paddingLeft: 8,
    fontSize: 14,
  },
  viewterms: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  viewtermstext: {
    color: Colors.primary,
    fontSize: 14,
  },
  terms: {
    borderRadius: 4,
    maxHeight: '80%',
    padding: 8,
    margin: 16,
    backgroundColor: Colors.formBackground,
  },
  done: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginTop: 8,
  },
  donetext: {
    color: Colors.text,
    fontSize: 16,
  },
  termsheader: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  demo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  demoText: {
    color: Colors.grey,
    textAlign: 'center',
  },
  space: {
    width: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  required: {
    fontSize: 12,
    color: Colors.grey,
    width: 32,
    padding: 8,
    textAlign: 'center',
  },
  requiredtext: {
    textAlignVertical: 'center',
  },
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.formBackground,
    borderRadius: 4,
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  token: {
    height: 52,
  },
  control: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: Colors.grey,
    marginRight: 16,
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
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  buttons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  inputwrapperpad: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 4,
    borderColor: Colors.divider,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  inputfield: {
    flexGrow: 1,
    textAlign: 'center',
    padding: 8,
    color: Colors.text,
  },
  create: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginBottom: 16,
  },
  createtext: {
    color: Colors.formFocus,
  },
  nocreate: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    borderRadius: 4,
    borderColor: Colors.divider,
    borderWidth: 1,
    marginBottom: 16,
  },
  nocreatetext: {
    color: Colors.grey,
  },
  login: {
    marginTop: 16,
    marginBottom: 16,
  },
  logintext: {
    color: Colors.primary,
  },
  nologintext: {
    color: Colors.disabled,
  },
    
})

