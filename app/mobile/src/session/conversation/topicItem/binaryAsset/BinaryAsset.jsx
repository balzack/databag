import { ActivityIndicator, Alert, View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import Colors from 'constants/Colors';
import { useBinaryAsset } from './useBinaryAsset.hook';
import { styles } from './BinaryAsset.styled';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';

export function BinaryAsset({ asset, dismiss }) {

  const { state, actions } = useBinaryAsset();


  const download = async () => {
    try {
      const url = asset.encrypted ? `file://${asset.decrypted}` : asset.data;
      await actions.download(asset.label, asset.extension, url);
    }
    catch (err) { 
      Alert.alert(
        'Download Failed',
        'Please try again.'
      )
    }
  };

  return (
    <View style={{ ...styles.container, width: state.width, height: state.height }}>
      <Text style={styles.label}>{ asset.label }</Text>
      <TouchableOpacity style={styles.close} onPress={dismiss}>
        <MatIcons name="window-close" size={32} color={Colors.white} />
      </TouchableOpacity>
      <View style={styles.action}>
        { asset.encrypted && !asset.decrypted && (
          <TouchableOpacity style={styles.loading} onPress={dismiss}>
            <ActivityIndicator color={Colors.white} size="large" />
            { asset.total > 1 && (
              <Text style={styles.decrypting}>{ asset.block } / { asset.total }</Text>
            )}
          </TouchableOpacity>
        )}
        { !state.downloading && (!asset.encrypted || asset.decrypted) && (
          <TouchableOpacity onPress={download}>
            <AntIcons name="download" size={64} color={Colors.white} />
          </TouchableOpacity>
        )}
        { state.downloading && (
          <ActivityIndicator color={Colors.white} size="large" />
        )}
      </View>
      <Text style={styles.extension}>{ asset.extension }</Text>
    </View>
  );
}
  
