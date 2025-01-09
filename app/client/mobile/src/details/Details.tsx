import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {Surface, Divider, IconButton, Text, TextInput} from 'react-native-paper';
import {styles} from './Details.styled';
import {useDetails} from './useDetails.hook';
import { Confirm } from '../confirm/Confirm';

export function Details({close, closeAll}: {close: ()=>void, closeAll: ()=>void}) {
  const { state, actions } = useDetails();
  const [alert, setAlert] = useState(false);
  const [saving, setSaving] = useState(false);

  const alertParams = {
    title: state.strings.operationFailer,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: () => {
        setAlert(false);
      },
    },
  };

  const saveSubject = async () => {
    if (!saving) {
      setSaving(true);
      try {
        await actions.saveSubject();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSaving(false);
    }    
  }

  return (
    <View style={styles.details}>
      <SafeAreaView style={styles.header}>
        {close && (
          <View style={styles.close}>
            <IconButton style={styles.closeIcon} compact="true" mode="contained" icon="arrow-left" size={28} onPress={close} />
          </View>
        )}
        <Text style={styles.title}>{ state.strings.details }</Text>
        {close && (
          <View style={styles.close} />
        )} 
      </SafeAreaView>
      <Divider style={styles.divider} />
      <View style={styles.info}>
        { state.host && (
          <Surface style={styles.subject} elevation={4}>
            <TextInput
              style={styles.input}
              underlineStyle={styles.underline}
              mode="flat"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              value={state.editSubject}
              label={state.strings.subject}
              disabled={state.locked}
              left={<TextInput.Icon style={styles.icon} icon="label-outline" />}
              onChangeText={value => actions.setEditSubject(value)}
            />
            { state.subject !== state.editSubject && (
              <IconButton style={styles.icon} icon="undo-variant" onPress={actions.undoSubject} />
            )}
            { state.subject !== state.editSubject && (
              <IconButton style={styles.icon} icon="content-save-outline" loading={saving} onPress={saveSubject} /> 
            )} 
          </Surface>
        )}
      </View>
      <ScrollView style={styles.members}>

      </ScrollView>
      <Confirm show={alert} params={alertParams} />
    </View>
  )
}

// input if host and unsealed
// text otherwise
