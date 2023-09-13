import { TextInput, Text, View } from 'react-native';

export function InputField({ label, value, autoCapitalize, spellCheck, multiline, onChangeText, style }) {

  return (
    <View style={style?.container}>
      <View style={style?.label}>
        { !(value == null || value.length == 0) && (
          <Text style={style?.labelText}>{ label }</Text>
        )}
      </View>
      <TextInput placeholder={label} lineBreakStategyIOS={'standard'} placeholderTextColor={style?.labelText?.color} value={value} autoCapitalize={autoCapitalize} spellCheck={spellCheck} multiline={multiline} style={style?.input} onChangeText={onChangeText} />
    </View>
  );
}

