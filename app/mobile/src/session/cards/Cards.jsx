import { useState } from 'react';
import { Alert, FlatList, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Cards.styled';
import { useCards } from './useCards.hook';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'constants/Colors';
import { CardItem } from './cardItem/CardItem';
import { useNavigation } from '@react-navigation/native';

export function CardsHeader({ filter, setFilter, sort, setSort, openRegistry }) {
  const navigation = useNavigation();

  return (
    <View style={styles.title}>
      { sort && (
        <TouchableOpacity style={styles.sort} onPress={() => setSort(false)}>
          <MatIcons style={styles.icon} name="sort-alphabetical-ascending" size={18} color={Colors.text} />
        </TouchableOpacity>
      )}
      { !sort && (
        <TouchableOpacity style={styles.sort} onPress={() => setSort(true)}>
          <MatIcons style={styles.icon} name="sort-alphabetical-ascending" size={18} color={Colors.disabled} />
        </TouchableOpacity>
      )}
      <View style={styles.inputwrapper}>
        <AntIcons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
        <TextInput style={styles.inputfield} value={filter} onChangeText={setFilter}
            autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Contacts" />
        <View style={styles.space} />
      </View>
      <TouchableOpacity style={styles.add} onPress={() => openRegistry(navigation)}>
        <AntIcons name={'adduser'} size={16} color={Colors.white} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
        <Text style={styles.newtext}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

export function CardsBody({ filter, sort, openContact, addChannel }) {
  const { state, actions } = useCards(filter, sort);

  const call = async (contact) => {
    try {
      actions.call(contact);
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Call Contact',
        'Please try again.'
      )
    }
  }

  return (
    <>
      { state.cards.length == 0 && (
        <View style={styles.notfound}>
          <Text style={styles.notfoundtext}>No Contacts Found</Text>
        </View>
      )}
      { state.cards.length != 0 && (
        <FlatList style={styles.cards}
          data={state.cards}
          initialNumToRender={25}
          renderItem={({ item }) => <CardItem item={item} openContact={openContact}
            enableIce={state.enableIce} call={() => call(item)} message={() => addChannel(item.cardId)} />}
          keyExtractor={item => item.cardId}
        />
      )}
    </>
  );
}

export function Cards({ openRegistry, openContact, addChannel }) {
  const [filter, setFilter] = useState();
  const [sort, setSort] = useState(false);

  return (
    <View>
      <CardsHeader filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} openRegistry={openRegistry} />
      <CardsBody filter={filter} sort={sort} openContact={openContact} addChannel={addChannel} />
    </View>
  );
}

