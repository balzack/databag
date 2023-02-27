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
    flexGrow: 1,
    textAlign: 'center',
    padding: 4,
    color: Colors.text,
    fontSize: 14,
  },
  icon: {
    paddingLeft: 8,
  },
  addbottom: {
    backgroundColor: Colors.primary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
  },
  addtop: {
    backgroundColor: Colors.primary,
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  addtext: {
    paddingLeft: 8,
    color: Colors.white,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 4,
  },
  columnbottom: {
    paddingLeft: 24,
    paddingRight: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: Colors.divider,
  },
  columntop: {
    paddingLeft: 24,
    paddingRight: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
});

