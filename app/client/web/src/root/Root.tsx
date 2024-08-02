import React, { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { ContextType } from '../context/ContextType'
import { TextInput, Button } from '@mantine/core'
import '@mantine/core/styles.css';
import classes from './Root.module.css'

export function Root () {
  const settings = useContext(SettingsContext) as ContextType;

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
      classNames={{
        input: classes.focus
      }}
    />
    </div>
}
