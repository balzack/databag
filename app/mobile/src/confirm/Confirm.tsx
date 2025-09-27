import React from 'react';
import {Modal, View} from 'react-native';
import {BlurView} from '../utils/BlurView';
import {useTheme, Surface, Text, Button} from 'react-native-paper';
import {styles} from './Confirm.styled';

export type ConfirmParams = {
  title?: string;
  prompt?: string;
  cancel?: {label: string; action: () => void};
  close?: {label: string; action: () => void};
  confirm?: {label: string; action: () => Promise<void>};
};

export function Confirm({show, busy, params}) {
  const theme = useTheme();

  return (
    <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={show} onRequestClose={params.cancel ? params.cancel.action : () => {}}>
      <View style={styles.modal}>
        <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackColor="dark" />
        <View style={styles.content}>
          <Surface elevation={2} style={{...styles.surface, backgroundColor: theme.colors.elevation.level12}}>
            <View style={styles.surfaceContent}>
              {params.title && <Text style={styles.title}>{params.title}</Text>}
              {params.prompt && <Text style={styles.prompt}>{params.prompt}</Text>}
              <View style={styles.controls}>
                {params.cancel && (
                  <Button mode="outlined" style={{...styles.control, borderColor: theme.colors.primary}} disabled={busy} onPress={params.cancel.action}>
                    {params.cancel.label}
                  </Button>
                )}
                {params.confirm && (
                  <Button mode="contained" style={styles.control} textColor="white" loading={busy} onPress={params.confirm.action}>
                    {params.confirm.label}
                  </Button>
                )}
                {params.close && (
                  <Button mode="text" style={styles.control} loading={busy} onPress={params.close.action}>
                    {params.close.label}
                  </Button>
                )}
              </View>
            </View>
          </Surface>
        </View>
      </View>
    </Modal>
  );
}
