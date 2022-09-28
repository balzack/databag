import { useContext } from 'react';
import { FlatList, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Cards.styled';
import { useCards } from './useCards.hook';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/AntDesign';
import { CardItem } from './cardItem/CardItem';
import Colors from 'constants/Colors';
import { useNavigation } from '@react-navigation/native';

export function CardsTitle({ state, actions, openRegistry }) {
  const navigation = useNavigation();

  return (
    <View style={styles.title}>
      { state.sorting && (
        <TouchableOpacity style={styles.sort} onPress={actions.unsort}>
          <Ionicons style={styles.icon} name="menufold" size={18} color={Colors.text} />
        </TouchableOpacity>
      )}
      { !state.sorting && (
        <TouchableOpacity style={styles.sort} onPress={actions.sort}>
          <Ionicons style={styles.icon} name="menufold" size={18} color={Colors.disabled} />
        </TouchableOpacity>
      )}
      <View style={styles.inputwrapper}>
        <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
        <TextInput style={styles.inputfield} value={state.filter} onChangeText={actions.setFilter}
            autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Contacts" />
        <View style={styles.space} />
      </View>
      <TouchableOpacity style={styles.add} onPress={() => openRegistry(navigation)}>
        <Ionicons name={'adduser'} size={16} color={Colors.white} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
        <Text style={styles.newtext}>New</Text>
      </TouchableOpacity>
    </View>
    );
}

export function CardsBody({ state, actions, openContact }) {
  return (
    <FlatList style={styles.cards}
      data={state.cards}
      renderItem={({ item }) => <CardItem item={item} openContact={openContact} />}
      keyExtractor={item => item.cardId}
    />
  );
}

export function Cards({ openRegistry, openContact }) {
  const { state, actions } = useCards();
  return (
    <View style={styles.container}>
      { state.tabbed && (
        <>
          <View style={styles.topbar}>
            { state.sorting && (
              <TouchableOpacity style={styles.sort} onPress={actions.unsort}>
                <Ionicons style={styles.icon} name="menufold" size={18} color={Colors.text} />
              </TouchableOpacity>
            )}
            { !state.sorting && (
              <TouchableOpacity style={styles.sort} onPress={actions.sort}>
                <Ionicons style={styles.icon} name="menufold" size={18} color={Colors.disabled} />
              </TouchableOpacity>
            )}
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
              <TextInput style={styles.inputfield} value={state.filter} onChangeText={actions.setFilter}
                  autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Contacts" />
              <View style={styles.space} />
            </View>
            <TouchableOpacity style={styles.add} onPress={openRegistry}>
              <Ionicons name={'adduser'} size={16} color={Colors.white} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
              <Text style={styles.newtext}>New</Text>
            </TouchableOpacity>
          </View>
          <FlatList style={styles.cards}
            data={state.cards}
            renderItem={({ item }) => <CardItem item={item} openContact={openContact} />}
            keyExtractor={item => item.cardId}
          />
        </>
      )}
      { !state.tabbed && (
        <>
          <View style={styles.searcharea}>
            <SafeAreaView edges={['top', 'right']} style={styles.searchbar}>
              { state.sorting && (
                <TouchableOpacity style={styles.sort} onPress={actions.unsort}>
                  <Ionicons style={styles.icon} name="menufold" size={18} color={Colors.text} />
                </TouchableOpacity>
              )}
              { !state.sorting && (
                <TouchableOpacity style={styles.sort} onPress={actions.sort}>
                  <Ionicons style={styles.icon} name="menufold" size={18} color={Colors.disabled} />
                </TouchableOpacity>
              )}
              <View style={styles.inputwrapper}>
                <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
                <TextInput style={styles.inputfield} value={state.filter} onChangeText={actions.setFilter}
                    autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Contacts" />
              </View>
              <TouchableOpacity style={styles.add} onPress={openRegistry}>
                <Ionicons name={'adduser'} size={16} color={Colors.white} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
          <SafeAreaView edges={['right']} style={styles.searcharea}>
            <FlatList style={styles.cards}
              data={state.cards}
              renderItem={({ item }) => <CardItem item={item} openContact={openContact} />}
              keyExtractor={item => item.cardId}
            />
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

