import { useState, useEffect } from 'react';
import { Alert, FlatList, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Cards.styled';
import { useCards } from './useCards.hook';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'constants/Colors';
import { CardItem } from './cardItem/CardItem';

export function Cards({ navigation, openContact, openRegistry, addChannel }) {
  const { state, actions } = useCards();

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.title}>
            { state.sort && (
              <TouchableOpacity style={styles.sort} onPress={() => actions.setSort(false)}>
                <MatIcons style={styles.icon} name="sort-ascending" size={24} color={Colors.text} />
              </TouchableOpacity>
            )}
            { !state.sort && (
              <TouchableOpacity style={styles.sort} onPress={() => actions.setSort(true)}>
                <MatIcons style={styles.icon} name="sort-ascending" size={24} color={Colors.unsetText} />
              </TouchableOpacity>
            )}
            <View style={styles.inputwrapper}>
              <AntIcons style={styles.icon} name="search1" size={16} color={Colors.inputPlaceholder} />
              <TextInput placeholder={ state.strings.contactFilter } placeholderTextColor={Colors.inputPlaceholder} 
                  style={styles.inputfield} autoCapitalize={'none'} spellCheck={false} onChangeText={actions.setFilter} />
              <View style={styles.space} />
            </View>
            <TouchableOpacity style={styles.add} onPress={() => openRegistry(navigation)}>
              <AntIcons name={'adduser'} size={16} color={Colors.primaryButtonText} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
              <Text style={styles.newtext}>{ state.strings.add }</Text>
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, state.sort]);

  const call = async (contact) => {
    try {
      actions.call(contact);
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        state.strings.error,
        state.strings.tryAgain,
      );
    }
  }

  return (
    <View style={styles.container}>
      { !navigation && (
        <View style={styles.title}>
          { state.sort && (
            <TouchableOpacity style={styles.sort} onPress={() => actions.setSort(false)}>
              <MatIcons style={styles.icon} name="sort-ascending" size={24} color={Colors.text} />
            </TouchableOpacity>
          )}
          { !state.sort && (
            <TouchableOpacity style={styles.sort} onPress={() => actions.setSort(true)}>
              <MatIcons style={styles.icon} name="sort-ascending" size={24} color={Colors.unsetText} />
            </TouchableOpacity>
          )}
          <View style={styles.inputwrapper}>
            <AntIcons style={styles.icon} name="search1" size={16} color={Colors.inputPlaceholder} />
            <TextInput placeholder={ state.strings.contactFilter } placeholderTextColor={Colors.inputPlaceholder} value={state.filter}
                style={styles.inputfield} autoCapitalize={'none'} spellCheck={false} onChangeText={actions.setFilter} />
            <View style={styles.space} />
          </View>
          <TouchableOpacity style={styles.add} onPress={() => openRegistry(navigation)}>
            <AntIcons name={'adduser'} size={16} color={Colors.primaryButtonText} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
            <Text style={styles.newtext}>{ state.strings.add }</Text>
          </TouchableOpacity>
        </View>
      )}
      { state.cards.length == 0 && (
        <View style={styles.notfound}>
          <Text style={styles.notfoundtext}>{ state.strings.noContacts }</Text>
        </View>
      )}
      { state.cards.length != 0 && (
        <FlatList style={styles.cards}
          data={state.cards}
          initialNumToRender={25}
          renderItem={({ item }) => <CardItem item={item} openContact={openContact}
            enableIce={state.enableIce} call={() => call(item)} message={() => addChannel(item.cardId)} 
            canMessage={(item.seal && state.sealable) || state.allowUnsealed} />}
          keyExtractor={item => item.cardId}
        />
      )}
    </View>
  );
}

