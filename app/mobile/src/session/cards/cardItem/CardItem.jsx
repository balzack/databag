import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from '../../../utils/Logo';
import { styles } from './CardItem.styled';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../constants/Colors';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { getLanguageStrings } from '../../../constants/Strings';

export function CardItem({ item, openContact, enableIce, call, message, canMessage }) {

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
          <TouchableOpacity style={styles.profile} activeOpacity={1} onPress={select}>
            <Logo src={item.logo} width={48} height={48} radius={6} />
            <View style={styles.detail}>
              <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit={true}>{ item.name }</Text>
              <Text style={styles.handle} numberOfLines={1} adjustsFontSizeToFit={true}>{ item.username }</Text>
            </View>
          </TouchableOpacity>
          { item.status === 'connected' && (
            <Menu>
              <MenuTrigger customStyles={styles.trigger}>
                <View style={styles.more}>
                  { item.status === 'connected' && item.offsync && (
                    <MatIcons name={'dots-horizontal'} size={32} color={Colors.offsync} />
                  )}
                  { item.status === 'connected' && !item.offsync && (
                    <MatIcons name={'dots-horizontal'} size={32} color={Colors.connected} />
                  )}
                </View>
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={{ width: 'auto' }} style={styles.options}>
                <MenuOption onSelect={select}>
                  <Text style={styles.option}>{ strings.viewProfile }</Text>
                </MenuOption>
                { canMessage && (
                  <MenuOption onSelect={message}>
                    <Text style={styles.option}>{ strings.messageContact }</Text>
                  </MenuOption>
                )}
                { enableIce && (
                  <MenuOption onSelect={call}>
                    <Text style={styles.option}>{ strings.callContact }</Text>
                  </MenuOption>
                )}
              </MenuOptions>
            </Menu>
          )}
          { item.status !== 'connected' && (
            <TouchableOpacity style={styles.more} onPress={select}>
              { item.status === 'requested' && (
                <MatIcons name={'circle-medium'} size={24} color={Colors.requested} />
              )}
              { item.status === 'connecting' && (
                <MatIcons name={'circle-medium'} size={24} color={Colors.connecting} />
              )}
              { item.status === 'pending' && (
                <MatIcons name={'circle-medium'} size={24} color={Colors.pending} />
              )}
              { item.status === 'confirmed' && (
                <MatIcons name={'circle-medium'} size={24} color={Colors.confirmed} />
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
      { !item.cardId && (
        <View style={styles.space} />
      )}
    </View>
  );
}

