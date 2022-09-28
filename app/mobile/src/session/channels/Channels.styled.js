import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  searchbar: {
    paddingRight: 8,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    paddingBottom: 8,
  },
  inputwrapper: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: Colors.white,
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 4,
    paddingBottom: 4,
  },
  inputfield: {
    flex: 1,
    textAlign: 'center',
    padding: 4,
    color: Colors.text,
    fontSize: 14,
  },
  icon: {
    paddingLeft: 8,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
  },
  channels: {
    flexShrink: 1,
    flexGrow: 1,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  addbottom: {
    backgroundColor: Colors.primary,
    marginRight: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
  },
  add: {
    backgroundColor: Colors.primary,
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  newtext: {
    paddingLeft: 8,
    color: Colors.white,
  },
  bottomArea: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: Colors.divider,
  },
})

