import React, { useState } from 'react'
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
  PinInput,
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
  const [otpOpened, { open: otpOpen, close: otpClose }] = useDisclosure(false)
  const [disabled, setDisabled] = useState(false)

  const login = async () => {
    if (!state.loading) {
      actions.setLoading(true)
      try {
        if (state.mode === 'account') {
          await actions.accountLogin()
        } else if (state.mode === 'create') {
          await actions.accountCreate()
        } else if (state.mode === 'reset') {
          await actions.accountAccess()
        } else if (state.mode === 'admin') {
          await actions.adminLogin()
        }
        otpClose()
      } catch (err: any) {
        console.log(err.message)
        if (
          err.message === '405' ||
          err.message === '403' ||
          err.message === '429'
        ) {
          if (err.message === '429') {
            setDisabled(true)
          } else {
            setDisabled(false)
          }
          otpOpen()
        } else {
          alertOpen()
        }
      }
      actions.setLoading(false)
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
                onClick={() => actions.setMode('account')}
              />
            )}
            <Title className={classes.title} order={1}>
              Databag
            </Title>
            {state.mode === 'account' && (
              <>
                <Title order={3}>{state.strings.login}</Title>
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                <Space h="md" />
                <TextInput
                  className={classes.input}
                  size="md"
                  value={state.username}
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
                  value={state.password}
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
                  loading={state.loading}
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
                  onClick={() => actions.setMode('reset')}
                >
                  {state.strings.forgotPassword}
                </Button>
              </>
            )}
            {state.mode === 'reset' && (
              <>
                <Title order={3}>{state.strings.accessAccount}</Title>
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                <Space h="md" />
                <TextInput
                  className={classes.input}
                  size="md"
                  value={state.token}
                  leftSectionPointerEvents="none"
                  leftSection={<IconKey />}
                  placeholder={state.strings.accessCode}
                  onChange={(event) =>
                    actions.setToken(event.currentTarget.value)
                  }
                />
                <Space h="md" />
                <Button
                  variant="filled"
                  className={classes.submit}
                  disabled={!state.token}
                  onClick={login}
                  loading={state.loading}
                >
                  {state.strings.login}
                </Button>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  onClick={() => actions.setMode('account')}
                >
                  {state.strings.accountLogin}
                </Button>
              </>
            )}
            {state.mode === 'create' && (
              <>
                <Space h="md" />
                <Title order={3}>{state.strings.createAccount}</Title>
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                <Space h="md" />
                <TextInput
                  className={
                    state.available === 0 ? classes.input : classes.hidden
                  }
                  size="md"
                  value={state.token}
                  leftSectionPointerEvents="none"
                  leftSection={<IconKey />}
                  placeholder={state.strings.accessCode}
                  onChange={(event) =>
                    actions.setToken(event.currentTarget.value)
                  }
                />
                <TextInput
                  className={classes.input}
                  size="md"
                  value={state.username}
                  leftSectionPointerEvents="none"
                  leftSection={<IconUser />}
                  placeholder={state.strings.username}
                  onChange={(event) =>
                    actions.setUsername(event.currentTarget.value)
                  }
                  error={state.taken ? true : false}
                />
                <PasswordInput
                  className={classes.input}
                  size="md"
                  value={state.password}
                  leftSection={<IconLock />}
                  placeholder={state.strings.password}
                  onChange={(event) =>
                    actions.setPassword(event.currentTarget.value)
                  }
                />
                <PasswordInput
                  className={classes.input}
                  size="md"
                  value={state.confirm}
                  leftSection={<IconLock />}
                  placeholder={state.strings.confirmPassword}
                  onChange={(event) =>
                    actions.setConfirm(event.currentTarget.value)
                  }
                />
                <Space h="md" />
                <Button
                  variant="filled"
                  className={classes.submit}
                  onClick={login}
                  disabled={
                    state.taken ||
                    !state.username ||
                    !state.password ||
                    state.password !== state.confirm
                  }
                >
                  {state.strings.create}
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => actions.setMode('account')}
                  size="compact-sm"
                >
                  {state.strings.accountLogin}
                </Button>
              </>
            )}
            {state.mode === 'admin' && (
              <>
                <Title order={3}>{state.strings.admin}</Title>
                <Button
                  size="compact-sm"
                  variant="transparent"
                  onClick={urlOpen}
                >
                  {state.host}
                </Button>
                <Space h="md" />
                <PasswordInput
                  className={classes.input}
                  size="md"
                  value={state.password}
                  leftSection={<IconLock />}
                  placeholder={state.strings.password}
                  onChange={(event) =>
                    actions.setPassword(event.currentTarget.value)
                  }
                />
                <Space h="md" />
                <Button
                  variant="filled"
                  className={classes.submit}
                  disabled={!state.password}
                  onClick={login}
                  loading={state.loading}
                >
                  {state.strings.login}
                </Button>
              </>
            )}
            <div className={classes.settings}>
              <Select
                label={state.strings.theme}
                data={state.themes}
                value={state.scheme}
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
          value={state.host}
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
      <Modal
        opened={otpOpened}
        onClose={otpClose}
        withCloseButton={false}
        centered
      >
        <div className={classes.mfa}>
          <div className={classes.mfaTitle}>{state.strings.mfaTitle}</div>
          <div className={classes.mfaDescription}>{state.strings.mfaEnter}</div>
          <PinInput
            value={state.code}
            length={6}
            className={classes.mfaPin}
            onChange={(event) => actions.setCode(event)}
          />
          <div className={classes.mfaDisabled}>
            {disabled ? state.strings.mfaDisabled : ''}
          </div>
          <div className={classes.mfaControl}>
            <Button variant="outline" onClick={otpClose}>
              {state.strings.cancel}
            </Button>
            <Button
              variant="filled"
              onClick={login}
              loading={state.loading}
              disabled={state.code.length !== 6}
            >
              {state.strings.login}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
