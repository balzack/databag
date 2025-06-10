import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  component: {
    width: '100%',
    height: '100%',
  },
  registry: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  smCards: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overscrollBehavior: 'none',
  },
  smCard: {
    width: '100%',
    height: 72,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    icon: {
      borderRadius: 24,
      overflow: 'hidden',
    }
  },
  inputBorder: {
    borderRadius: 12,
    borderWidth: 0,
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
  navIcon: {
    color: 'white',
    width: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    flexShrink: 0,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  divider: {
    width: '100%',
    height: 2,
  },
  inputServer: {
    flexGrow: 2,
    flex: 2,
    height: 40,
    marginRight: 8,
    marginLeft: 4,
    display: 'flex',
    borderRadius: 4,
    marginBottom: 6,
    marginTop: 4,
  },
  inputUsername: {
    flexGrow: 2,
    flex: 2,
    height: 40,
    marginRight: 8,
    marginLeft: 4,
    display: 'flex',
    borderRadius: 4,
    marginBottom: 6,
    marginTop: 4,
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
    paddingBottom: 64,
  },
  card: {
    width: '100%',
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
});
