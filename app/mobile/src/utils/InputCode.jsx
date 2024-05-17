import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export function InputCode({ onChangeText, style }) {

  const [code, setCode] = useState('');

  const updateCode = (value) => {
    if (value.length >= 6) {
      onChangeText(value.slice(0, 6));
    }
    else {
      onChangeText('');
    }
    setCode(value.slice(0, 6));
  }

  return (
    <View style={style}>
      <View style={{ width: '100%', height: 32 }}>
        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: 32, height: '100%', borderWidth: 1, borderRadius: 4, backgroundColor: '#dddddd', borderColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Text style={{ fontSize: 20 }}>{ code.charAt(0) }</Text>
          </View>
          <View style={{ width: 32, height: '100%', borderWidth: 1, borderRadius: 4, backgroundColor: '#dddddd', borderColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Text style={{ fontSize: 20 }}>{ code.charAt(1) }</Text>
          </View>
          <View style={{ width: 32, height: '100%', borderWidth: 1, borderRadius: 4, backgroundColor: '#dddddd', borderColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Text style={{ fontSize: 20 }}>{ code.charAt(2) }</Text>
          </View>
          <View style={{ width: 32, height: '100%', borderWidth: 1, borderRadius: 4, backgroundColor: '#dddddd', borderColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Text style={{ fontSize: 20 }}>{ code.charAt(3) }</Text>
          </View>
          <View style={{ width: 32, height: '100%', borderWidth: 1, borderRadius: 4, backgroundColor: '#dddddd', borderColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Text style={{ fontSize: 20 }}>{ code.charAt(4) }</Text>
          </View>
          <View style={{ width: 32, height: '100%', borderWidth: 1, borderRadius: 4, backgroundColor: '#dddddd', borderColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Text style={{ fontSize: 20 }}>{ code.charAt(5) }</Text>
          </View>
        </View>
        <TextInput style={{ width: '100%', height: '100%', opacity: 0, position: 'absolute', top: 0, left: 0 }} onChangeText={updateCode} autoCorrect={false} autoCapitalize="none" maxLength={6} />
      </View>
    </View>
  );
}

