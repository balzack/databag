import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: Colors.screenBase,
  },
  label: {
    color: Colors.text,
    padding: 4,
    fontFamily: 'Roboto',
  },
  group: {
    backgroundColor: Colors.areaBase,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.screenBase,
  },
  entry: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 4,
    height: 40,
  },
  icon: {
    flex: 2,
    alignItems: 'center',
  },
  option: {
    flex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  control: {
    flex: 2,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    paddingRight: 8,
    color: Colors.text,
    fontFamily: 'Roboto',
  },
  optionLink: {
    fontSize: 16,
    paddingRight: 8,
    color: Colors.linkText,
    fontFamily: 'Roboto',
  },
  dangerLink: {
    fontSize: 16,
    paddingRight: 8,
    color: Colors.dangerText,
    fontFamily: 'Roboto',
  },
  track: {
    false: Colors.disabledIndicator,
    true: Colors.enabledIndicator,
  },
  notifications: {
    transform: [{ scaleX: .6 }, { scaleY: .6 }],
  },
});
