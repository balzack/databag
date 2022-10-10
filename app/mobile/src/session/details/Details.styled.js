import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  info: {
    paddingLeft: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  subject: {
    fontSize: 18,
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 8,
    color: Colors.text,
    alignItems: 'center',
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
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  controls: {
    paddingTop: 16,
  },
  button: {
    width: 128,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    margin: 8,
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    padding: 4,
  },
  members: {
    paddingTop: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  membersLabel: {
    paddingLeft: 16,
    width: '100%',
  },
  cards: {
    width: '100%',
  },
})

