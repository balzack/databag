import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: Colors.screenBase,
  },
  details: {
    width: '100%',
    position: 'relative',
    top: -16,
    minHeight: 32,
    backgroundColor: 'yellow',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    backgroundColor: Colors.screenBase,
  },
  control: {
    position: 'absolute',
    width: '100%',
    top: -16,
    display: 'flex',
    alignItems: 'center',
  },
  edit: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.screenBase,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editLabel: {
    color: Colors.text,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 12,
    fontFamily: 'roboto',
  },
});

