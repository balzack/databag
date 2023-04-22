import { useState } from 'react';
import { TouchableOpacity, Text, View, FlatList } from 'react-native';
import { useSharing } from './useSharing.hook';
import { styles } from './Sharing.styled';
import { SharingItem } from './sharingItem/SharingItem';

export function Sharing({ select, cancel }) {

  const [selection, setSelection] = useState(null);
  const { state, actions } = useSharing();

  return (
    <View style={styles.sharingBase}>
      <View style={styles.sharingFrame}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Select Topic for Sharing</Text>
        </View>
        <FlatList
          style={styles.content}
          data={state.channels}
          initialNumToRender={25}
          renderItem={({ item }) => <SharingItem select={setSelection} selection={selection} item={item} />}
          keyExtractor={item => (`${item.cardId}:${item.channelId}`)}
        />
        <View style={styles.controls}>
          { !selection && (
            <View style={styles.disabled}>
              <Text style={styles.disabledText}>Select</Text>
            </View>
          )}
          { selection && (
            <TouchableOpacity style={styles.select} onPress={() => select(selection)}>
              <Text style={styles.selectText}>Select</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.cancel} onPress={cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
