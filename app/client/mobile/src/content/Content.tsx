import React from 'react';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native';
import {useContent} from './useContent.hook';

export function Content() {
  const { state, actions } = useContent();

  return (
    <SafeAreaView>
      <Text>CONTENT PANE</Text>
    </SafeAreaView>
  );
}
