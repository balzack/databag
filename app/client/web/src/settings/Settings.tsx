import { useSettings } from './useSettings.hook';
import { Radio, Group, Select, Switch, Text, Image, Button, UnstyledButton } from '@mantine/core';
import classes from './Settings.module.css';
import { IconClock, IconCalendar, IconVideo, IconMicrophone, IconWorld, IconBrightness, IconTicket, IconCloudLock, IconBell, IconEye, IconBook, IconMapPin, IconLogout, IconLogin } from '@tabler/icons-react'
import avatar from '../images/avatar.png'

export function Settings() {
  const { state, actions } = useSettings();

  return (
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
      <div className={classes.entry}>
        <div className={classes.entryIcon}>
          <IconLogout />
        </div>
        <Text className={classes.entryLabel}>{ state.strings.logout }</Text>
      </div>
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
          <Text className={classes.entryLabel}>{ state.strings.changeLogin }</Text>
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
            onChange={(language) => actions.setLanguage(language as string)}
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
            onChange={(language) => actions.setLanguage(language as string)}
          />
        </div>
      </div>
    </div>
  );
}

