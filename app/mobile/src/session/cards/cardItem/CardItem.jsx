import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from 'utils/Logo';
import { styles } from './CardItem.styled';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { getLanguageStrings } from 'constants/Strings';

export function CardItem({ item, openContact, enableIce, call, message }) {

  const strings = getLanguageStrings();
  
  const select = () => {
    const { guid, name, handle, node, location, description, imageSet } = item;
    const contact = { guid, name, handle, node, location, description, imageSet };
    openContact(contact);
  };

  return (
    <View>
      { item.cardId && (
        <View style={styles.container}>
          <View style={styles.profile}>
            <Logo src={item.logo} width={48} height={48} radius={6} />
            <View style={styles.detail}>
              <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit={true}>{ item.name }</Text>
              <Text style={styles.handle} numberOfLines={1} adjustsFontSizeToFit={true}>{ item.username }</Text>
            </View>
          </View>
          { item.status === 'connected' && (
            <Menu>
              <MenuTrigger customStyles={styles.trigger}>
                { item.status === 'connected' && item.offsync && (
                  <MatIcons name={'dots-horizontal'} size={32} color={Colors.offysnc} />
                )}
                { item.status === 'connected' && !item.offsync && (
                  <MatIcons name={'dots-horizontal'} size={32} color={Colors.connected} />
                )}
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={{ width: 'auto' }} style={styles.options}>
                <MenuOption onSelect={() => {}}>
                  <Text style={styles.option}>{ strings.viewProfile }</Text>
                </MenuOption>
                <MenuOption onSelect={() => {}}>
                  <Text style={styles.option}>{ strings.messageContact }</Text>
                </MenuOption>
                <MenuOption onSelect={() => {}}>
                  <Text style={styles.option}>{ strings.callContact }</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
          { item.status === 'requested' && (
            <MatIcons name={'dots-horizontal'} size={32} color={Colors.requested} />
          )}
          { item.status === 'connecting' && (
            <MatIcons name={'dots-horizontal'} size={32} color={Colors.connecting} />
          )}
          { item.status === 'pending' && (
            <MatIcons name={'dots-horizontal'} size={32} color={Colors.pending} />
          )}
          { item.status === 'confirmed' && (
            <MatIcons name={'dots-horizontal'} size={32} color={Colors.confirmed} />
          )}
        </View>
      )}
      { !item.cardId && (
        <View style={styles.space} />
      )}
    </View>
  );
}

