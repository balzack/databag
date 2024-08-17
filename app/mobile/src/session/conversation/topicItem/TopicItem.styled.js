import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
  },
  item: {
    borderTopWidth: 1,
    borderColor: Colors.itemDivider,
    paddingTop: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  name: {
    paddingLeft: 8,
    color: Colors.descriptionText,
  },
  timestamp: {
    paddingLeft: 8,
    fontSize: 11,
    paddingTop: 2,
    color: Colors.descriptionText,
  },
  carousel: {
    paddingLeft: 52,
    marginTop: 4,
    marginBottom: 4,
  },
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  status: {
    paddingLeft: 52,
  },
  sealed: {
    paddingRight: 16,
    paddingLeft: 52,
    color: Colors.grey,
    fontStyle: 'italic',
  },
  focused: {
    position: 'absolute',
    top: 0,
    right: 16,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  share: {
    width: 32,
    display: 'flex',
    alignItems: 'center',
  },
  message: {
    paddingRight: 16,
    paddingLeft: 52,
    color: Colors.fontColor,
  },
  save: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    width: 72,
    display: 'flex',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
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

