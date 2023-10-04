import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '80%',
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
  subjectIcon: {
    paddingRight: 4
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    backgroundColor: Colors.primaryButton,
    borderRadius: 4,
    margin: 8,
    padding: 2,
  },
  buttonText: {
    color: Colors.primaryButtonText,
    padding: 4,
  },
  members: {
    paddingBottom: 4,
    paddingTop: 24,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
    display: 'flex',
    flexDirection: 'row',
  },
  membersLabel: {
    paddingLeft: 16,
    color: Colors.text,
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
    paddingTop: 16,
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
    backgroundColor: Colors.modalBaseBase,
    padding: 16,
    width: '80%',
    maxWidth: 400,
  },
  editHeader: {
    fontSize: 18,
    paddingBottom: 8,
    color: Colors.text,
  },
  editMembers: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.itemDivider,
    borderRadius: 4,
    marginBottom: 8,
    height: 250,
  }, 
  notify: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  notifyText: {
    fontSize: 16,
    color: Colors.text,
  },
  modalOverlay: {
    width: '100%',
    height: '100%',
  },
  modalBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    backgroundColor: Colors.modalBase,
    width: '80%',
    maxWidth: 400,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: Colors.modalBorder,
    borderWidth: 1,
    padding: 16,
  },
  close: {
    borderWidth: 1,
    borderColor: Colors.closeButton,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    width: 72,
    display: 'flex',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.closeButtonText,
  }, 
  field: {
    input: {
      backgroundColor: Colors.inputBase,
      borderRadius: 8,
      minHeight: 48,
      maxHeight: 128,
      paddingLeft: 8,
    },
    inputText: {
      color: Colors.inputText,
    },
    label: {
      height: 16,
      paddingLeft: 8,
    },
    labelText: {
      color: Colors.inputPlaceholder,
      fontSize: 12,
    },
    container: {
      width: '100%',
    },
  },
  control: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  drawerActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '80%',
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  actionList: {
    alignItems: 'flex-end',
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
  },
  actionIcon: {
  },
  actionLabel: {
    color: Colors.linkText,
    fontSize: 10,
  },
  track: {
    false: Colors.idleFill,
    true: Colors.activeFill,
  },
  visibleSwitch: {
    transform: [{ scaleX: .6 }, { scaleY: .6 }],
  },
})
