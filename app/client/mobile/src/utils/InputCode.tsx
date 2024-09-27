import {TextInput, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useRef} from 'react';
import {styles} from './InputCode.styled';

export function InputCode({onChangeText, style}) {
  const [code, setCode] = useState('');
  const ref = useRef();

  const updateCode = value => {
    if (value.length >= 6) {
      onChangeText(value.slice(0, 6));
      if (ref.current) {
        ref.current.blur();
      }
    } else {
      onChangeText('');
    }
    setCode(value.slice(0, 6));
  };

  return (
    <View style={style}>
      <View style={{width: '100%', height: 32}}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.text}>{code.charAt(0)}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.text}>{code.charAt(1)}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.text}>{code.charAt(2)}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.text}>{code.charAt(3)}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.text}>{code.charAt(4)}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.text}>{code.charAt(5)}</Text>
          </View>
        </View>
        <TextInput
          style={styles.input}
          keyboardType={Platform.OS === 'ios' ? 'numeric' : 'number-pad'}
          onChangeText={updateCode}
          autoCorrect={false}
          autoCapitalize="none"
          maxLength={6}
          ref={ref}
        />
      </View>
    </View>
  );
}
