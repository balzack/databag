import { useState } from 'react';
import { TouchableOpacity, Text, View, FlatList } from 'react-native';
import { useSharing } from './useSharing.hook';
import { styles } from './Sharing.styled';
import { SharingItem } from './sharingItem/SharingItem';
import { getLanguageStrings } from '../../constants/Strings';

export function Sharing({ select, cancel }) {

  const strings = getLanguageStrings();
  const [selection, setSelection] = useState(null);
  const { state, actions } = useSharing();

  return (
    <View style={styles.sharingBase}>
      <View style={styles.sharingFrame}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{ strings.selectTopic }</Text>
        </View>
        <FlatList
          style={styles.content}
          data={state.channels}
          initialNumToRender={25}
          renderItem={({ item }) => <SharingItem select={setSelection} selection={selection} item={item} />}
          keyExtractor={item => (`${item.cardId}:${item.channelId}`)}
        />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.cancel} onPress={cancel}>
            <Text style={styles.cancelText}>{ strings.cancel }</Text>
          </TouchableOpacity>
          { !selection && (
            <View style={styles.disabled}>
              <Text style={styles.disabledText}>{ strings.select }</Text>
            </View>
          )}
          { selection && (
            <TouchableOpacity style={styles.select} onPress={() => select(selection)}>
              <Text style={styles.selectText}>{ strings.select }</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}
