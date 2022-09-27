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
    paddingTop: 32,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searcharea: {
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  searchbar: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  inputwrapper: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: Colors.white,
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 8,
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
  cards: {
    flexGrow: 1,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  addbottom: {
    marginRight: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
  },
  bottomText: {
    color: Colors.primary,
    paddingLeft: 8,
  },
  add: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
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
  up: {
    marginRight: 8,
  },
  sort: {
    paddingRight: 12,
    transform: [ { rotate: "270deg" }, ] 
  },
  findarea: {
    borderTopWidth: 1,
    borderColor: Colors.divider,
  }
})

