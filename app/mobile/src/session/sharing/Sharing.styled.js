import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  sharingBase: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.8)'
  },
  sharingFrame: {
    backgroundColor: Colors.drawerBase,
    width: '80%',
    height: '80%',
    maxWidth: 400,
    maxHeight: 600,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: Colors.text,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 4,
    borderTopWidth: 1,
    borderColor: Colors.divider,
  },
  select: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 8,
  },
  selectText: {
    fontSize: 16,
    color: Colors.white,
  },
  disabled: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.grey,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 8,
  },
  disabledText: {
    fontSize: 16,
    color: Colors.grey,
  },
  cancel: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.text,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 8,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.text,
  },

});

