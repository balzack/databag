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
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.modalBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mfaOverlay: {
    width: '100%',
    height: '100%',
  },
  mfaBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mfaContainer: {
    backgroundColor: Colors.modalBase,
    borderColor: Colors.modalBorder,
    borderWidth: 1,
    width: '80%',
    maxWidth: 400, 
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
  },
  mfaTitle: {
    fontSize: 20,
  },
  mfaDescription: {
    fontSize: 16,
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
    backgroundColor: Colors.modalBase,
  },
  done: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 4,
    backgroundColor: Colors.closeButton,
    marginTop: 8,
  },
  donetext: {
    color: Colors.closeButtonText,
    fontSize: 16,
  },
  termsheader: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.text,
  },
  termstext: {
    color: Colors.text,
  },
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.modalBase,
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
    color: Colors.descriptionText,
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
    backgroundColor: Colors.inputBase,
    marginBottom: 16,
    alignItems: 'center',
  },
  inputfield: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    flexGrow: 1,
    color: Colors.inputText,
  },
  login: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    backgroundColor: Colors.primaryButton,
    borderRadius: 4,
  },
  logintext: {
    color: Colors.primaryButtonText,
  },
  nologin: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    borderRadius: 4,
    backgroundColor: Colors.disabledButton,
  },
  nologintext: {
    color: Colors.disabledButtonText,
  },
  create: {
    marginTop: 16,
  },
  createtext: {
    color: Colors.linkText,
  },
  nocreatetext: {
    color: Colors.disabled,
  },
  bottom: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },    
})

