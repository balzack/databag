import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    flexShrink: 1,
    minWidth: 0,
  },
  info: {
    paddingLeft: 8,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flexShrink: 1,
  },
  subject: {
    fontSize: 18,
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 8,
    color: Colors.text,
    alignItems: 'center',
    minWidth: 0,
    flexShrink: 1,
  },
  subjectText: {
    fontSize: 18,
    flexShrink: 1,
    minWidth: 0,
    color: Colors.text,
    paddingRight: 4,
  },
  created: {
    fontSize: 16,
    color: Colors.text,
  },
  mode: {
    fontSize: 16,
    color: Colors.text,
  },
  title: {
    fontSize: 20,
  },
  controls: {
    paddingTop: 16,
  },
  button: {
    width: 128,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    margin: 8,
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    padding: 4,
  },
  members: {
    paddingBottom: 4,
    paddingTop: 24,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    display: 'flex',
    flexDirection: 'row',
  },
  membersLabel: {
    paddingLeft: 16,
  },
  unknown: {
    color: Colors.grey,
    paddingLeft: 8,
  },
  cards: {
    width: '100%',
  },
  save: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    width: 72,
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: Colors.primary,
  },
  saveText: {
    color: Colors.white,
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
  },
  input: {
    fontSize: 14,
    flexGrow: 1,
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
  },
  editMembers: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 4,
    marginBottom: 8,
    height: 250,
  },   
})

