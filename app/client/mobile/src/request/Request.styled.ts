import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 32,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  label: {
    textAlign: 'center',
  },
  request: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  connect: {
    backgroundColor: 'transparent',
  },
  navHeader: {
    height: 72,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitle: {
    color: 'white',
    flexGrow: 1,
    textAlign: 'center',
  },
  navIcon: {
    color: 'white',
    width: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollWrapper: {
    width: '100%',
    flexGrow: 1,
    height: 1,
  },
  empty: {
    width: '100%',
    flexGrow: 1,
    height: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContacts: {
    color: '#888888',
  },
  scrollContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overscrollBehavior: 'none',
    flexGrow: 1,
    minHeight: 0,
    flexShrink: 1,
  },
  cardsContainer: {
    paddingBottom: 64,
  },
  card: {
    width: '100%',
    height: 72,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
    icon: {
      borderRadius: 24,
      overflow: 'hidden',
    },
  },
  submit: {
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  control: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 16,
  },
});
