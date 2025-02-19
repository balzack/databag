import React from 'react';
import {SafeAreaView, Image, View, Pressable} from 'react-native';
import {ActivityIndicator, RadioButton, Switch, Surface, Divider, TextInput, Text} from 'react-native-paper';
import {styles} from './Setup.styled';
import {useSetup} from './useSetup.hook';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Confirm } from '../confirm/Confirm';

export function Setup() {
  const { state, actions } = useSetup();

  const errorParams = {
    title: state.strings.operationFailed, 
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: actions.clearError,
    },      
  };

console.log(state.setup);

  return (
    <View style={styles.setup}>
      <View style={styles.header}>
        <View style={styles.busy}>
          { state.loading && (
            <ActivityIndicator size={18} />
          )}
        </View>
        <Text style={styles.title}>{ state.strings.setup }</Text>
        <View style={styles.busy}>
          { state.updating && (
            <ActivityIndicator size={18} />
          )}
        </View>
      </View>
      <Divider style={styles.line} bold={true} />
      <KeyboardAwareScrollView enableOnAndroid={true} style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.keyType}:</Text>
          <View style={styles.radioSelect}>
            <View style={styles.radio}>
              <Text style={styles.radioLabel}>RSA2048</Text>
              <RadioButton.Item 
                disabled={state.loading}
                rippleColor="transparent"
                style={styles.radioButton}
                label=""
                mode="android"
                status={state.setup?.keyType === 'RSA_2048' ? 'checked' : 'unchecked'}
                onPress={() => { actions.setKeyType('RSA_2048') }}
              />
            </View>
            <View style={styles.radio}>
              <Text style={styles.radioLabel}>RSA4096</Text>
              <RadioButton.Item
                disabled={state.loading}
                rippleColor="transparent"
                style={styles.radioButton}
                label=""
                mode="android"
                status={state.setup?.keyType === 'RSA_4096' ? 'checked' : 'unchecked'}
                onPress={() => { actions.setKeyType('RSA_4096') }}
              />
            </View>
          </View>
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{ state.strings.federatedHost }:</Text>
          <Surface mode="flat" elevation={5} style={styles.inputSurface}>
            <TextInput
              dense={true}
              style={styles.input}
              outlineColor="transparent"
              activeOutlineColor="transparent"
              autoCapitalize={false}
              underlineStyle={styles.inputUnderline}
              mode="outlined"
              disabled={state.loading}
              placeholder={state.strings.hostHint}
              value={state.setup?.domain}
              onChangeText={value => actions.setDomain(value)}
            />
          </Surface>
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{ state.strings.storageLimit }:</Text>
          <Surface mode="flat" elevation={5} style={styles.inputSurface}>
            <TextInput
              type="number"
              dense={true}
              style={styles.input}
              keyboardType="numeric"
              outlineColor="transparent"
              activeOutlineColor="transparent"
              autoCapitalize={false}
              underlineStyle={styles.inputUnderline}
              mode="outlined"
              disabled={state.loading}
              placeholder={state.strings.storageHint}
              value={state.accountStorage}
              onChangeText={value => actions.setAccountStorage(value)}
            />
          </Surface>
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.accountCreation}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.enableOpenAccess} disabled={state.loading} onValueChange={()=>actions.setEnableOpenAccess(!state.setup?.enableOpenAccess)} />
          { state.setup?.enableOpenAccess && (
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                type="number"
                dense={true}
                style={styles.input}
                keyboardType="numeric"
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder={state.strings.storageHint}
                value={state.openAccessLimit}
                onChangeText={value => actions.setOpenAccessLimit(value)}
              />
            </Surface>
          )}
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.enableNotifications}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.pushSupported} disabled={state.loading} onValueChange={()=>actions.setPushSupported(!state.setup?.pushSupported)} />
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.allowUnsealed}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.allowUnsealed} disabled={state.loading} onValueChange={()=>actions.setAllowUnsealed(!state.setup?.allowUnsealed)} />
        </View>
        <Divider style={styles.divider} bold={false} />
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.enableImage}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.enableImage} disabled={state.loading} onValueChange={()=>actions.setEnableImage(!state.setup?.enableImage)} />
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.enableAudio}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.enableAudio} disabled={state.loading} onValueChange={()=>actions.setEnableAudio(!state.setup?.enableAudio)} />
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.enableVideo}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.enableVideo} disabled={state.loading} onValueChange={()=>actions.setEnableVideo(!state.setup?.enableVideo)} />
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.enableBinary}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.enableBinary} disabled={state.loading} onValueChange={()=>actions.setEnableBinary(!state.setup?.enableBinary)} />
        </View>
        <Divider style={styles.divider} bold={false} />
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.enableWeb}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.enableIce} disabled={state.loading} onValueChange={()=>actions.setEnableIce(!state.setup?.enableIce)} />
        </View>
        { state.setup?.enableIce && (
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.enableService}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.enableService} disabled={state.loading} onValueChange={()=>actions.setEnableService(!state.setup?.enableService)} />
          </View>
        )}
        { state.setup?.enableIce && state.setup?.enableService && (
          <View style={styles.option}>
            <Text style={styles.label}>TURN_KEY_ID:</Text>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder="ID"
                value={state.setup?.iceUsername}
                onChangeText={value => actions.setIceUsername(value)}
              />
            </Surface>
          </View>
        )}
        { state.setup?.enableIce && state.setup?.enableService && (
          <View style={styles.option}>
            <Text style={styles.label}>TURN_KEY_API_TOKEN:</Text>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder="TOKEN"
                value={state.setup?.icePassword}
                onChangeText={value => actions.setIcePassword(value)}
              />
            </Surface>
          </View>
        )}
        { state.setup?.enableIce && !state.setup?.enableService && (
          <View style={styles.option}>
            <Text style={styles.label}>{ state.strings.serverUrl }:</Text>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder={state.strings.urlHint}
                value={state.setup?.iceUrl}
                onChangeText={value => actions.setIceUrl(value)}
              />
            </Surface>
          </View>
        )}
        { state.setup?.enableIce && !state.setup?.enableService && (
          <View style={styles.option}>
            <Text style={styles.label}>{ state.strings.webUsername }:</Text>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder={state.strings.username}
                value={state.setup?.iceUsername}
                onChangeText={value => actions.setIceUsername(value)}
              />
            </Surface>
          </View>
        )}
        { state.setup?.enableIce && !state.setup?.enableService && (
          <View style={styles.option}>
            <Text style={styles.label}>{ state.strings.webPassword }:</Text>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder={state.strings.password}
                value={state.setup?.icePassword}
                onChangeText={value => actions.setIcePassword(value)}
              />
            </Surface>
          </View>
        )}
      </KeyboardAwareScrollView>
      <Divider style={styles.line} bold={true} />
      <Confirm show={state.error} params={errorParams} />
    </View>
  );
}

