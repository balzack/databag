import { useSettings } from './useSettings.hook';
import { Modal, TextInput, PasswordInput, Radio, Group, Select, Switch, Text, Image, Button, UnstyledButton } from '@mantine/core';
import classes from './Settings.module.css';
import { IconLock, IconUser, IconClock, IconCalendar, IconUsers, IconVideo, IconMicrophone, IconWorld, IconBrightness, IconTicket, IconCloudLock, IconBell, IconEye, IconBook, IconMapPin, IconLogout, IconLogin } from '@tabler/icons-react'
import avatar from '../images/avatar.png'
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks'

export function Settings({ showLogout }) {
  const { state, actions } = useSettings();
  const [changeOpened, { open: changeOpen, close: changeClose }] = useDisclosure(false)

  const logout = () => modals.openConfirmModal({
    title: state.strings.confirmLogout,
    withCloseButton: false,
    overlayProps: {
      backgroundOpacity: 0.55,
      blur: 3,
    },
    children: (
      <Switch label={state.strings.allDevices} size="md" onChange={(ev) => actions.setAll(ev.currentTarget.checked)} />
    ),
    labels: { confirm: state.strings.logout, cancel: state.strings.cancel },
    onConfirm: actions.logout,
  });

  const setLogin = async () => {
    try {
throw new Error("NO");
      await actions.setLogin();
      changeClose();
    }
    catch (err) {
      console.log(err);
      modals.openConfirmModal({
        title: state.strings.operationFailed,
        withCloseButton: true,
        overlayProps: {
          backgroundOpacity: 0.55,
          blur: 3,
        },
        children: (
          <Text>{state.strings.tryAgain}</Text>
        ),
        cancelProps: { display: 'none' },
        confirmProps: { display: 'none' },
      });

    }
  }

  return (
    <>
      { state.profileSet && (
        <div className={classes.settings}>
          <Text className={classes.header}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
          <div className={classes.image}>
            { state.profile.imageSet && (
              <div className={classes.imageSet}>
                <Image radius="md" src={state.imageUrl} /> 
                <div className={classes.edit}>
                  <Button size="compact-md" variant="light">{ state.strings.edit }</Button>
                </div>
              </div>
            )}
            { !state.profile.imageSet && (
              <div className={classes.imageUnset}>
                <Image radius="md" src={avatar} /> 
                <Text className={classes.unsetEdit}>{ state.strings.edit }</Text>
              </div>
            )}
          </div>
          <div className={classes.section}>
            <div className={classes.divider} />
            <UnstyledButton className={classes.sectionEdit}>{ state.strings.edit }</UnstyledButton>
          </div>
          { !state.profile.name && (
            <Text className={classes.nameUnset}>{state.strings.name}</Text>
          )}
          { state.profile.name && (
            <Text className={classes.nameSet}>{state.profile.name}</Text>
          )}
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconMapPin />
            </div>
            { !state.profile.location && (
              <Text className={classes.entryUnset}>{state.strings.location}</Text>
            )}
            { state.profile.location && (
              <Text className={classes.entrySet}>{state.profile.location}</Text>
            )}
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconBook />
            </div>
            { !state.profile.description && (
              <Text className={classes.entryUnset}>{state.strings.description}</Text>
            )}
            { state.profile.description && (
              <Text className={classes.entrySet}>{state.profile.description}</Text>
            )}
          </div>
          <div className={classes.divider} />
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconEye />
            </div>
            <Text className={classes.entryLabel}>{ state.strings.registry }</Text>
            <Switch className={classes.entryControl} />
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconCloudLock />
            </div>
            <Text className={classes.entryLabel}>{ state.strings.manageTopics }</Text>
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconBell />
            </div>
            <Text className={classes.entryLabel}>{ state.strings.enableNotifications }</Text>
            <Switch className={classes.entryControl} />
          </div>
          <div className={classes.divider} />
          { showLogout && (
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconLogout />
              </div>
              <Text className={classes.entryLabel} onClick={logout}>{ state.strings.logout }</Text>
            </div>
          )}
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconTicket />
            </div>
            <Text className={classes.entryLabel}>{ state.strings.mfaTitle }</Text>
            <Switch className={classes.entryControl} />
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconLogin />
            </div>
              <Text className={classes.entryLabel} onClick={changeOpen}>{ state.strings.changeLogin }</Text>
          </div>
          <div className={classes.divider} />

          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconClock />
            </div>
            <Text className={classes.controlLabel}>{ state.strings.timeFormat }</Text>
            <Radio.Group
              name="timeFormat"
              className={classes.radio}
              value={state.timeFormat}
              onChange={actions.setTimeFormat}
            >
              <Group mt="xs">
                <Radio value="12h" label={ state.strings.timeUs } />
                <Radio value="24h" label={ state.strings.timeEu } />
              </Group>
            </Radio.Group>
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconCalendar />
            </div>
            <Text className={classes.controlLabel}>{ state.strings.dateFormat }</Text>
            <Radio.Group
              name="dateFormat"
              className={classes.radio}
              value={state.dateFormat}
              onChange={actions.setDateFormat}
            >
              <Group mt="xs">
                <Radio value="mm/dd" label={ state.strings.dateUs } />
                <Radio value="dd/mm" label={ state.strings.dateEu } />
              </Group>
            </Radio.Group>
          </div>

          <div className={classes.selects}>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconBrightness />
              </div>
              <Text className={classes.controlLabel}>{ state.strings.theme }</Text>
              <Select
                className={classes.entryControl}
                size="xs"
                data={state.themes}
                value={state.scheme}
                onChange={(theme) => actions.setTheme(theme as string)}
              />
            </div>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconWorld />
              </div>
              <Text className={classes.controlLabel}>{ state.strings.language }</Text>
              <Select
                className={classes.entryControl}
                size="xs"
                data={state.languages}
                value={state.language}
                onChange={(language) => actions.setLanguage(language as string)}
              />
            </div>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconMicrophone />
              </div>
              <Text className={classes.controlLabel}>{ state.strings.microphone }</Text>
              <Select
                className={classes.entryControl}
                size="xs"
                data={[ { value: '', label: state.strings.default }, ...state.audioInputs ]}
                value={state.audioId ? state.audioId : ''}
                onChange={actions.setAudio}
              />
            </div>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconVideo />
              </div>
              <Text className={classes.controlLabel}>{ state.strings.camera }</Text>
              <Select
                className={classes.entryControl}
                size="xs"
                data={[ { value: '', label: state.strings.default }, ...state.videoInputs ]}
                value={state.videoId ? state.videoId : ''}
                onChange={actions.setVideo}
              />
            </div>
          </div>
        </div>
      )}
      <Modal
        title={state.strings.changeLogin}
        opened={changeOpened}
        onClose={changeClose}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
      >
        <div className={classes.change}>
          <TextInput
            className={classes.input}
            size="md"
            value={state.username}
            leftSectionPointerEvents="none"
            leftSection={<IconUser />}
            rightSection={state.taken ? <IconUsers /> : null}
            placeholder={state.strings.username}
            onChange={(event) =>
              actions.setUsername(event.currentTarget.value)
            }
            error={state.taken}
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
          <div className={classes.control}>
            <Button variant="default" onClick={changeClose}>
              {state.strings.cancel}
            </Button>
            <Button
              variant="filled"
              onClick={setLogin}
              loading={state.loading}
              disabled={state.taken || !state.checked || !state.username || !state.password || state.confirm !== state.password}
            >
              {state.strings.save}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

