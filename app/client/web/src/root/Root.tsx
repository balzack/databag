import React, { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { ContextType } from '../context/ContextType'
import { TextInput, Button } from '@mantine/core'
import { useMantineTheme } from '@mantine/core';

export function Root () {
  const theme = useMantineTheme();
  const settings = useContext(SettingsContext);

  const press = () => {
    console.log("PRESSED");
  }

  return <div><span>ROOT</span>
    <Button
      variant="danger"
      onClick={press}>Download</Button>
    <TextInput
      color="lime.4"
      label="Input label"
      description="Input description"
      placeholder="Input placeholder"
    />
    <div style={{ width: 100, height: 100, backgroundColor: theme.colors.surface[8], }} />
    </div>
}
