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
    borderRadius: 8,
    overflow: 'hidden',
  },
  newContactButton: {
    height: 48,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 24,
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
    }
  },
  tabs: {
    position: 'absolute',
    top: 64,
    height: 28,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
  },
  action: {
    backgroundColor: 'transparent',
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
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    height: 48,
    maxHeight: 48,
    borderRadius: 8,
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
});
