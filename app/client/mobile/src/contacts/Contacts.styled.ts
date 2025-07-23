import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  contacts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  menu: {
    borderRadius: 8,
  },
  menuContent: {
    borderRadius: 8,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  headerSurface: {
    width: '100%',
    height: 72,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    gap: 16,
  },
  searchSurface: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    borderRadius: 8,
  },
  menuOption: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 16,
    gap: 8,
  },
  newContactButton: {
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newContactContent: {
    height: 52,
  },
  tabContainer: {
    width: '100%',
    height: '100%',
  },
  inputBorder: {
    borderRadius: 12,
    borderWidth: 0,
  },
  smCards: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overscrollBehavior: 'none',
    paddingTop: 26,
    paddingBottom: 64,
  },
  smCard: {
    width: '100%',
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    icon: {
      borderRadius: 28,
      overflow: 'hidden',
    },
  },
  tabs: {
    position: 'absolute',
    top: 68,
    height: 28,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
  },
  actionPad: {
    paddingLeft: 12,
  },
  action: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    margin: 0,
    width: 64,
    height: 64,
  },
  tab: {
    width: 108,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  opaque: {},
  opacity: {
    opacity: 0.8,
  },
  tabSet: {
    fontSize: 12,
    color: 'white',
  },
  tabUnset: {
    fontSize: 12,
  },
  button: {
    borderRadius: 8,
    marginRight: 4,
  },
  indicator: {
    borderRightWidth: 2,
  },
  header: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
    paddingLeft: 8,
    width: '100%',
    zIndex: 1,
  },
  sort: {
    borderRadius: 4,
  },
  divider: {
    width: '100%',
    height: 2,
  },
  inputSurface: {
    flexGrow: 1,
    height: 40,
    marginRight: 8,
    marginLeft: 4,
    display: 'flex',
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'transparent',
    height: 52,
  },
  inputUnderline: {
    display: 'none',
  },
  icon: {
    backgroundColor: 'transparent',
  },
  none: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 128,
  },
  noneLabel: {
    fontSize: 20,
    color: Colors.placeholder,
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overscrollBehavior: 'none',
  },
  cardsContainer: {
    paddingBottom: 200,
  },
  card: {
    width: '100%',
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
  surfaceMaxWidth: {
    width: '100%',
  },
  tabVisible: {
    display: 'block',
  },
  tabHidden: {
    display: 'none',
  },
});
