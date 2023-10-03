
import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  more: {
    marginTop: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.horizontalDivider,
    height: 48,
    marginLeft: 16,
    marginRight: 16,
  },
  headertitle: {
    display: 'flex',
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
  }, 
  titletext: {
    fontSize: 18,
    flexShrink: 1,
    paddingLeft: 16,
    paddingRight: 16,
    color: Colors.text,
  },
  titlebutton: {
    paddingRight: 8,
    width: 32,
  },
  headerclose: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
  },
  thread: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
  },
  loading: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptytext: {
    fontSize: 18,
    color: Colors.disabled,
  },

  topics: {
    paddingBottom: 32,
  },
  conversation: {
    flexShrink: 1,
    flexGrow: 1,
    minHeight: 0,
    paddingTop: 8,
  },
  save: {
    borderRadius: 4,
    backgroundColor: Colors.primary,
    width: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: Colors.white,
  },
  canceltext: {
    color: Colors.text,
  },
  cancel: {
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    width: 72,
    display: 'flex',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    maxHeight: 92,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    flexGrow: 1,
    color: Colors.text,
  },
  editControls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  editContainer: {
    backgroundColor: Colors.formBackground,
    padding: 16,
    width: '80%',
    maxWidth: 400,
  },
  editHeader: {
    fontSize: 18,
    paddingBottom: 16,
    color: Colors.text,
  },
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

