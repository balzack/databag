import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function InputField({ label, value, secret, autoCapitalize, spellCheck, multiline, onChangeText, style }) {

  const [hidden, setHidden] = useState(true);

  return (
    <View style={style?.container}>
      <View style={style?.label}>
        { !(value == null || value.length == 0) && (
          <Text style={style?.labelText}>{ label }</Text>
        )}
      </View>
      <View style={{...style?.input, paddingLeft: 8, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexGrow: 1 }}>
          <TextInput placeholder={label} placeholderTextColor={style?.labelText?.color} value={value}
              autoCapitalize={autoCapitalize} spellCheck={spellCheck} multiline={multiline}
              secureTextEntry={secret && hidden} onChangeText={onChangeText} style={{ ...style?.inputText, padding: 8 }} />
        </View>
        { secret && !hidden && (
          <TouchableOpacity style={{ width: 48, display: 'flex', alignItems: 'center' }} onPress={() => setHidden(true)}>
            <MatIcons name="eye-off-outline" size={20} color={style?.labelText?.color} />
          </TouchableOpacity>
        )}
        { secret && hidden && (
          <TouchableOpacity style={{ width: 48, display: 'flex', alignItems: 'center' }} onPress={() => setHidden(false)}>
            <MatIcons name="eye-outline" size={20} color={style?.labelText?.color} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

