import { useContext } from 'react';
import { FlatList, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Cards.styled';
import { useCards } from './useCards.hook';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/AntDesign';
import { CardItem } from './cardItem/CardItem';
import Colors from 'constants/Colors';

export function Cards({ openRegistry }) {
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
            renderItem={({ item }) => <CardItem item={item} />}
            keyExtractor={item => item.cardId}
          />
        </>
      )}
      { !state.tabbed && (
        <SafeAreaView edges={['right']} style={styles.searcharea}>
          <View style={styles.searchbar}>
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
          </View>
          <FlatList style={styles.cards}
            data={state.cards}
            renderItem={({ item }) => <CardItem item={item} />}
            keyExtractor={item => item.cardId}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

