import React from 'react'
import { useAccess } from './useAccess.hook'
import classes from './Access.module.css'
import {
  Select,
  Space,
  Title,
  Image,
  Button,
  Modal,
  PasswordInput,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import left from '../images/login.png'
import {
  IconLock,
  IconUser,
  IconSettings,
  IconServer,
  IconKey,
} from '@tabler/icons-react'

export function Access() {
  const { state, actions } = useAccess()
  const [alertOpened, { open: alertOpen, close: alertClose }] =
    useDisclosure(false)
  const [urlOpened, { open: urlOpen, close: urlClose }] = useDisclosure(false)

  const login = async () => {
    try {
      await actions.accountLogin()
    } catch (err) {
      console.log(err)
      alertOpen()
    }
  }

  return (
    <div className={classes.split}>
      {(state.display === 'medium' || state.display === 'large') && (
        <div className={classes.left}>
          <Image className={classes.splash} src={left} fit="contain" />
        </div>
      )}
      {state.display != null && (
        <div className={classes.right}>
          <div className={classes.frame}>
            {state.mode !== 'admin' && (
              <Button
                variant="transparent"
                className={classes.float}
                leftSection={<IconSettings size={28} />}
                onClick={() => actions.setMode('admin')}
              />
            )}
            {state.mode === 'admin' && (
              <Button
                variant="transparent"
                className={classes.float}
                leftSection={<IconUser size={28} />}
                onClick={() => actions.setMode('login')}
              />
            )}
            <Title className={classes.title} order={1}>
              Databag
            </Title>
            {state.mode === 'login' && (
              <>
                <Title order={3}>{state.strings.login}</Title>
                <Space h="md" />
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                <TextInput
                  className={classes.input}
                  size="md"
                  leftSectionPointerEvents="none"
                  leftSection={<IconUser />}
                  placeholder={state.strings.username}
                  onChange={(event) =>
                    actions.setUsername(event.currentTarget.value)
                  }
                />
                <PasswordInput
                  className={classes.input}
                  size="md"
                  leftSection={<IconLock />}
                  placeholder={state.strings.password}
                  onChange={(event) =>
                    actions.setPassword(event.currentTarget.value)
                  }
                  onKeyDown={(ev) => {
                    if (ev.code === 'Enter' && state.password && state.username)
                      login()
                  }}
                />
                <Space h="md" />
                <Button
                  variant="filled"
                  className={classes.submit}
                  onClick={login}
                  disabled={!state.username || !state.password}
                >
                  {state.strings.login}
                </Button>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  onClick={() => actions.setMode('create')}
                >
                  {state.strings.createAccount}
                </Button>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  onClick={() => actions.setMode('access')}
                >
                  {state.strings.forgotPassword}
                </Button>
              </>
            )}
            {state.mode === 'access' && (
              <>
                <Title order={3}>{state.strings.accessAccount}</Title>
                <Space h="md" />
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                <TextInput
                  className={classes.input}
                  size="md"
                  leftSectionPointerEvents="none"
                  leftSection={<IconKey />}
                  placeholder={state.strings.accessCode}
                  onChange={(event) =>
                    actions.setToken(event.currentTarget.value)
                  }
                />
                <Space h="md" />
                <Button variant="filled" className={classes.submit}>
                  {state.strings.login}
                </Button>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  onClick={() => actions.setMode('login')}
                >
                  {state.strings.accountLogin}
                </Button>
              </>
            )}
            {state.mode === 'create' && (
              <>
                <Title order={3}>{state.strings.createAccount}</Title>
                <Space h="md" />
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                {(state.available === 0 || !state.availableSet) && (
                  <TextInput
                    className={classes.input}
                    size="md"
                    disabled={!state.availableSet}
                    leftSectionPointerEvents="none"
                    leftSection={<IconKey />}
                    placeholder={state.strings.accessCode}
                    onChange={(event) =>
                      actions.setToken(event.currentTarget.value)
                    }
                  />
                )}
                <TextInput
                  className={classes.input}
                  size="md"
                  leftSectionPointerEvents="none"
                  leftSection={<IconUser />}
                  placeholder={state.strings.username}
                  onChange={(event) =>
                    actions.setUsername(event.currentTarget.value)
                  }
                />
                <PasswordInput
                  className={classes.input}
                  size="md"
                  leftSection={<IconLock />}
                  placeholder={state.strings.password}
                  onChange={(event) =>
                    actions.setPassword(event.currentTarget.value)
                  }
                />
                <PasswordInput
                  className={classes.input}
                  size="md"
                  leftSection={<IconLock />}
                  placeholder={state.strings.confirmPassword}
                  onChange={(event) =>
                    actions.setConfirm(event.currentTarget.value)
                  }
                />
                <Space h="md" />
                <Button variant="filled" className={classes.submit}>
                  {state.strings.create}
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => actions.setMode('login')}
                  size="compact-sm"
                >
                  {state.strings.accountLogin}
                </Button>
              </>
            )}
            {state.mode === 'admin' && (
              <>
                <Title order={3}>{state.strings.admin}</Title>
                <Space h="md" />
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                <PasswordInput
                  className={classes.input}
                  size="md"
                  leftSection={<IconLock />}
                  placeholder={state.strings.password}
                  onChange={(event) =>
                    actions.setPassword(event.currentTarget.value)
                  }
                />
                <Space h="md" />
                <Button variant="filled" className={classes.submit}>
                  {state.strings.login}
                </Button>
              </>
            )}
            <div className={classes.settings}>
              <Select
                label={state.strings.theme}
                data={state.themes}
                value={state.theme}
                onChange={(theme) => actions.setTheme(theme as string)}
              />
              <Select
                label={state.strings.language}
                data={state.languages}
                value={state.language}
                onChange={(language) => actions.setLanguage(language as string)}
              />
            </div>
          </div>
        </div>
      )}
      <Modal
        opened={urlOpened}
        onClose={urlClose}
        withCloseButton={false}
        centered
      >
        <TextInput
          className={classes.urlInput}
          size="md"
          leftSectionPointerEvents="none"
          leftSection={<IconServer />}
          placeholder={state.strings.host}
          value={state.node}
          onKeyDown={(ev) => {
            if (ev.code === 'Enter') urlClose()
          }}
          onChange={(event) => actions.setNode(event.currentTarget.value)}
        />
      </Modal>
      <Modal
        opened={alertOpened}
        onClose={alertClose}
        title={state.strings.operationFailed}
      >
        {state.strings.tryAgain}
      </Modal>
    </div>
  )
}
