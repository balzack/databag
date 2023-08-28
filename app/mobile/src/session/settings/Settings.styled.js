import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: Colors.screenBase,
  },
  label: {
    color: Colors.text,
    padding: 4,
    fontFamily: 'Roboto',
  },
  radio: {
    marginLeft: 34,
    display: 'flex',
    flexDirection: 'row',
  },
  idleRadioCircle: {
    borderWidth: 1,
    borderColor: Colors.activeBorder,
    borderRadius: 8,
    width: 16,
    height: 16,
  },
  activeRadioCircle: {
    borderWidth: 1,
    borderColor: Colors.activeBorder,
    backgroundColor: Colors.activeFill,
    borderRadius: 8,
    width: 16,
    height: 16,
  },
  radioLabel: {
    color: Colors.linkText,
    paddingLeft: 8,
    fontFamily: 'Roboto',
  },
  group: {
    backgroundColor: Colors.areaBase,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.screenBase,
  },
  entry: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 4,
    height: 40,
  },
  icon: {
    flex: 2,
    alignItems: 'center',
  },
  option: {
    flex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionControl: {
    flex: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  control: {
    flex: 2,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    paddingRight: 8,
    color: Colors.text,
    fontFamily: 'Roboto',
  },
  optionLink: {
    fontSize: 16,
    paddingRight: 8,
    color: Colors.linkText,
    fontFamily: 'Roboto',
  },
  dangerLink: {
    fontSize: 16,
    paddingRight: 8,
    color: Colors.dangerText,
    fontFamily: 'Roboto',
  },
  track: {
    false: Colors.disabledIndicator,
    true: Colors.enabledIndicator,
  },
  notifications: {
    transform: [{ scaleX: .6 }, { scaleY: .6 }],
  },

  modalWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalContainer: {
    backgroundColor: Colors.formBackground,
    padding: 16,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    fontSize: 18,
    paddingBottom: 16,
    color: Colors.text,
  },
  input: {
    fontSize: 14,
    flexGrow: 1,
    color: Colors.text,
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
  canceltext: {
    color: Colors.text,
  },
  modalList: {
    width: '100%', 
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 2,
  },
  modalControls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancel: {
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    width: 88,
    display: 'flex',
    alignItems: 'center',
  },
  save: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    width: 88,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: Colors.white,
  },
  disabled: {
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    padding: 8,
    borderRadius: 4,
    width: 88,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activity: {
    paddingRight: 4,
  },
  disabledText: {
    color: Colors.disabled,
  },
  sealUpdate: {
    position: 'absolute',
    top: 0,
    height: 36,
    left: 8,
    width: '100%',
  },
  sealableText: {
    color: Colors.text,
  },
  sealable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  enable: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 4,
  },
  enableText: {
    color: Colors.primary,
    fontSize: 16,
  },
  enableSwitch: {
    transform: [{ scaleX: .6 }, { scaleY: .6 }],
  },
});

