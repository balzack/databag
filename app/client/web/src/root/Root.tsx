import React from 'react'
import { TextInput, Button } from '@mantine/core'
import { useMantineTheme } from '@mantine/core'

export function Root() {
  const theme = useMantineTheme()

  const press = () => {
    console.log('PRESSED')
  }

  return (
    <div>
      <span>ROOT</span>
      <Button variant="danger" onClick={press}>
        Download
      </Button>
      <TextInput
        color="lime.4"
        label="Input label"
        description="Input description"
        placeholder="Input placeholder"
      />
      <div
        style={{
          width: 100,
          height: 100,
          backgroundColor: theme.colors.surface[8],
        }}
      />
    </div>
  )
}
