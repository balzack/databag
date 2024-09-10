import { useSettings } from './useSettings.hook'
import {
  Modal,
  Textarea,
  TextInput,
  PasswordInput,
  Radio,
  Group,
  Select,
  Switch,
  Text,
  Image,
  Button,
  UnstyledButton,
} from '@mantine/core'
import classes from './Settings.module.css'
import {
  IconLock,
  IconUser,
  IconClock,
  IconIdBadge,
  IconCalendar,
  IconUsers,
  IconVideo,
  IconMicrophone,
  IconWorld,
  IconBrightness,
  IconTicket,
  IconCloudLock,
  IconBell,
  IconEye,
  IconBook,
  IconMapPin,
  IconLogout,
  IconLogin,
} from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useState, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop/types'

export function Settings({ showLogout }: { showLogout: boolean }) {
  const imageFile = useRef(null as null | HTMLInputElement)
  const { state, actions } = useSettings()
  const [changeOpened, { open: changeOpen, close: changeClose }] =
    useDisclosure(false)
  const [detailsOpened, { open: detailsOpen, close: detailsClose }] =
    useDisclosure(false)
  const [imageOpened, { open: imageOpen, close: imageClose }] =
    useDisclosure(false)
  const [mfaOpened, { open: mfaOpen, close: mfaClose }] =
    useDisclosure(false)
  const [sealOpened, { open: sealOpen, close: sealClose }] =
    useDisclosure(false)
  const [savingLogin, setSavingLogin] = useState(false)
  const [savingDetails, setSavingDetails] = useState(false)
  const [savingImage, setSavingImage] = useState(false)
  const [savingRegistry, setSavingRegistry] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [savingSeal, setSavingSeal] = useState(false)
  const [savingMfa, setSavingMfa] = useState(false)

  const logout = () =>
    modals.openConfirmModal({
      title: state.strings.confirmLogout,
      withCloseButton: false,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: (
        <Switch
          label={state.strings.allDevices}
          size="md"
          onChange={(ev) => actions.setAll(ev.currentTarget.checked)}
        />
      ),
      labels: { confirm: state.strings.logout, cancel: state.strings.cancel },
      onConfirm: actions.logout,
    })

  const setRegistry = async (checked: boolean) => {
    if (!savingRegistry) {
      setSavingRegistry(true)
      try {
        if (checked) {
          await actions.enableRegistry()
        } else {
          await actions.disableRegistry()
        }
      } catch (err) {
        console.log(err)
        showError()
      }
      setSavingRegistry(false)
    }
  }

  const setNotifications = async (checked: boolean) => {
    if (!savingNotifications) {
      setSavingNotifications(true)
      try {
        if (checked) {
          await actions.enableNotifications()
        } else {
          await actions.disableNotifications()
        }
      } catch (err) {
        console.log(err)
        showError()
      }
      setSavingNotifications(false)
    }
  }

  const setSeal = async (checked: boolean) => {
    if (!savingSeal) {
      sealOpen();
      setSavingSeal(true);
      setSavingSeal(false);
    }
  }

  const setMfa = async () => {
    if (!savingMfa) {
      mfaOpen();
      setSavingMfa(true);
      setSavingMfa(false);
    }
  }

  const setDetails = async () => {
    if (!savingDetails) {
      setSavingDetails(true)
      try {
        await actions.setDetails()
        detailsClose()
      } catch (err) {
        console.log(err)
        showError()
      }
      setSavingDetails(false)
    }
  }

  const clickSelect = () => {
    if (imageFile.current) {
      imageFile.current.click()
    }
  }

  const selectImage = (target: HTMLInputElement) => {
    if (target.files) {
      var reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          actions.setEditImage(reader.result)
        }
      }
      reader.readAsDataURL(target.files[0])
    }
  }

  const setImage = async () => {
    if (!savingImage) {
      setSavingImage(true)
      try {
        await actions.setImage()
        imageClose()
      } catch (err) {
        console.log(err)
        showError()
      }
      setSavingImage(false)
    }
  }

  const setLogin = async () => {
    if (!savingLogin) {
      setSavingLogin(true)
      try {
        await actions.setLogin()
        changeClose()
      } catch (err) {
        console.log(err)
        showError()
      }
      setSavingLogin(false)
    }
  }

  const showError = () => {
    modals.openConfirmModal({
      title: state.strings.operationFailed,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.tryAgain}</Text>,
      cancelProps: { display: 'none' },
      confirmProps: { display: 'none' },
    })
  }

  const onCropComplete = useCallback((crop: Area) => {
    actions.setEditImageCrop(crop)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {state.profileSet && (
        <div className={classes.settings}>
          <Text
            className={classes.header}
          >{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
          <div className={classes.image}>
            {state.profile.imageSet && (
              <div className={classes.imageSet}>
                <Image radius="md" src={state.imageUrl} />
                <div className={classes.edit}>
                  <Button
                    size="compact-md"
                    variant="outlined"
                    onClick={imageOpen}
                  >
                    {state.strings.edit}
                  </Button>
                </div>
              </div>
            )}
            {!state.profile.imageSet && (
              <div className={classes.imageUnset} onClick={imageOpen}>
                <Image radius="md" src={state.imageUrl} />
                <Text className={classes.unsetEdit}>{state.strings.edit}</Text>
              </div>
            )}
          </div>
          <div className={classes.section}>
            <div className={classes.divider} />
            <UnstyledButton
              className={classes.sectionEdit}
              onClick={detailsOpen}
            >
              {state.strings.edit}
            </UnstyledButton>
          </div>
          {!state.profile.name && (
            <Text className={classes.nameUnset}>{state.strings.name}</Text>
          )}
          {state.profile.name && (
            <Text className={classes.nameSet}>{state.profile.name}</Text>
          )}
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconMapPin />
            </div>
            {!state.profile.location && (
              <Text className={classes.entryUnset}>
                {state.strings.location}
              </Text>
            )}
            {state.profile.location && (
              <Text className={classes.entrySet}>{state.profile.location}</Text>
            )}
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconBook />
            </div>
            {!state.profile.description && (
              <Text className={classes.entryUnset}>
                {state.strings.description}
              </Text>
            )}
            {state.profile.description && (
              <Text className={classes.entrySet}>
                {state.profile.description}
              </Text>
            )}
          </div>
          <div className={classes.divider} />
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconEye />
            </div>
            <Text className={classes.entryLabel}>{state.strings.registry}</Text>
            <Switch
              className={classes.entryControl}
              checked={state.config.searchable}
              onChange={(ev) => setRegistry(ev.currentTarget.checked)}
            />
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconCloudLock />
            </div>
            <Text className={classes.entryLabel} onClick={setSeal}>
              {state.strings.manageTopics}
            </Text>
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconBell />
            </div>
            <Text className={classes.entryLabel}>
              {state.strings.enableNotifications}
            </Text>
            <Switch
              className={classes.entryControl}
              checked={state.config.pushEnabled}
              onChange={(ev) => setNotifications(ev.currentTarget.checked)}
            />
          </div>
          <div className={classes.divider} />
          {showLogout && (
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconLogout />
              </div>
              <Text className={classes.entryLabel} onClick={logout}>
                {state.strings.logout}
              </Text>
            </div>
          )}
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconTicket />
            </div>
            <Text className={classes.entryLabel}>{state.strings.mfaTitle}</Text>
            <Switch className={classes.entryControl}
              onChange={(ev) => setMfa(ev.currentTarget.checked)}
            />
          </div>
          <div className={classes.entry}>
            <div className={classes.entryIcon}>
              <IconLogin />
            </div>
            <Text className={classes.entryLabel} onClick={changeOpen}>
              {state.strings.changeLogin}
            </Text>
          </div>
          <div className={classes.divider} />
          <div className={classes.selects}>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconClock />
              </div>
              <Text className={classes.controlLabel}>
                {state.strings.timeFormat}
              </Text>
              <Radio.Group
                name="timeFormat"
                className={classes.radio}
                value={state.timeFormat}
                onChange={actions.setTimeFormat}
              >
                <Group mt="xs">
                  <Radio value="12h" label={state.strings.timeUs} />
                  <Radio value="24h" label={state.strings.timeEu} />
                </Group>
              </Radio.Group>
            </div>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconCalendar />
              </div>
              <Text className={classes.controlLabel}>
                {state.strings.dateFormat}
              </Text>
              <Radio.Group
                name="dateFormat"
                className={classes.radio}
                value={state.dateFormat}
                onChange={actions.setDateFormat}
              >
                <Group mt="xs">
                  <Radio value="mm/dd" label={state.strings.dateUs} />
                  <Radio value="dd/mm" label={state.strings.dateEu} />
                </Group>
              </Radio.Group>
            </div>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconBrightness />
              </div>
              <Text className={classes.controlLabel}>
                {state.strings.theme}
              </Text>
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
              <Text className={classes.controlLabel}>
                {state.strings.language}
              </Text>
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
              <Text className={classes.controlLabel}>
                {state.strings.microphone}
              </Text>
              <Select
                className={classes.entryControl}
                size="xs"
                data={[
                  { value: '', label: state.strings.default },
                  ...state.audioInputs,
                ]}
                value={state.audioId ? state.audioId : ''}
                onChange={actions.setAudio}
              />
            </div>
            <div className={classes.entry}>
              <div className={classes.entryIcon}>
                <IconVideo />
              </div>
              <Text className={classes.controlLabel}>
                {state.strings.camera}
              </Text>
              <Select
                className={classes.entryControl}
                size="xs"
                data={[
                  { value: '', label: state.strings.default },
                  ...state.videoInputs,
                ]}
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
            value={state.handle}
            leftSectionPointerEvents="none"
            leftSection={<IconUser />}
            rightSection={state.taken ? <IconUsers /> : null}
            placeholder={state.strings.username}
            onChange={(event) => actions.setHandle(event.currentTarget.value)}
            error={state.taken}
          />
          <PasswordInput
            className={classes.input}
            size="md"
            value={state.password}
            leftSection={<IconLock />}
            placeholder={state.strings.password}
            onChange={(event) => actions.setPassword(event.currentTarget.value)}
          />
          <PasswordInput
            className={classes.input}
            size="md"
            value={state.confirm}
            leftSection={<IconLock />}
            placeholder={state.strings.confirmPassword}
            onChange={(event) => actions.setConfirm(event.currentTarget.value)}
          />
          <div className={classes.control}>
            <Button variant="default" onClick={changeClose}>
              {state.strings.cancel}
            </Button>
            <Button
              variant="filled"
              onClick={setLogin}
              loading={savingLogin}
              disabled={
                state.taken ||
                !state.checked ||
                !state.handle ||
                !state.password ||
                state.confirm !== state.password
              }
            >
              {state.strings.save}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title={state.strings.profileDetails}
        opened={detailsOpened}
        onClose={detailsClose}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
      >
        <div className={classes.change}>
          <TextInput
            className={classes.input}
            size="md"
            value={state.name}
            leftSectionPointerEvents="none"
            leftSection={<IconIdBadge />}
            placeholder={state.strings.name}
            onChange={(event) => actions.setName(event.currentTarget.value)}
          />
          <TextInput
            className={classes.input}
            size="md"
            value={state.location}
            leftSectionPointerEvents="none"
            leftSection={<IconMapPin />}
            placeholder={state.strings.location}
            onChange={(event) => actions.setLocation(event.currentTarget.value)}
          />
          <Textarea
            className={classes.input}
            size="md"
            minRows={1}
            maxRows={4}
            autosize={true}
            value={state.description}
            leftSectionPointerEvents="none"
            leftSection={<IconBook />}
            placeholder={state.strings.description}
            onChange={(event) =>
              actions.setDescription(event.currentTarget.value)
            }
          />
          <div className={classes.control}>
            <Button variant="default" onClick={detailsClose}>
              {state.strings.cancel}
            </Button>
            <Button
              variant="filled"
              onClick={setDetails}
              loading={savingDetails}
            >
              {state.strings.save}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={state.strings.profileImage}
        opened={imageOpened}
        onClose={imageClose}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
      >
        <div className={classes.change}>
          <div className={classes.cropper}>
            <Cropper
              image={state.editImage}
              crop={state.crop}
              zoom={state.zoom}
              aspect={1}
              onCropChange={actions.setCrop}
              onCropComplete={(area, crop) => onCropComplete(crop)}
              onZoomChange={actions.setZoom}
            />
          </div>
          <div className={classes.imageSelect}>
            <input
              type="file"
              id="file"
              accept="image/*"
              ref={imageFile}
              onChange={(e) => selectImage(e.target)}
              style={{ display: 'none' }}
            />
            <Button
              variant="default"
              className={classes.select}
              onClick={clickSelect}
            >
              {state.strings.selectImage}
            </Button>
            <div className={classes.control}>
              <Button variant="default" onClick={imageClose}>
                {state.strings.cancel}
              </Button>
              <Button variant="filled" onClick={setImage} loading={savingImage}>
                {state.strings.save}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title={state.strings.mfaTitle}
        opened={mfaOpened}
        onClose={mfaClose}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
      >
        <div className={classes.mfa} />
      </Modal>
      <Modal
        title={state.strings.sealedTopics}
        opened={sealOpened}
        onClose={sealClose}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
      >
        <div className={classes.seal} />
      </Modal>
    </>
  )
}
