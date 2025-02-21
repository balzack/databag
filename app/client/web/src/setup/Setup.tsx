import { useState } from 'react'
import classes from './Setup.module.css'
import { useSetup } from './useSetup.hook'
import { PinInput, Image, Button, Radio, Group, Loader, Modal, Divider, Text, TextInput, Switch, ActionIcon } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useDisclosure } from '@mantine/hooks'
import { IconCheck, IconCopy } from '@tabler/icons-react'

export function Setup() {
  const { state, actions } = useSetup();
  const [confirmingAuth, setConfirmingAuth] = useState(false);
  const [secretCopy, setSecretCopy] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [mfaOpened, { open: mfaOpen, close: mfaClose }] = useDisclosure(false)

  const confirmAuth = async () => {
    if (!confirmingAuth) {
      setConfirmingAuth(true);
      await actions.confirmMFAuth();
      mfaClose();
      setConfirmingAuth(false);
    }
  }

  const copySecret = async () => {
    if (!secretCopy) {
      try {
        navigator.clipboard.writeText(state.confirmMFAuthText)
        setSecretCopy(true);
        setTimeout(() => {
          setSecretCopy(false);
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const toggleAuth = async () => {
    if (!updating) {
      setUpdating(true);
      if (state.mfaEnabled) {
        await actions.disableMFAuth();
      } else {
        await actions.enableMFAuth();
        mfaOpen();
      }
      setUpdating(false);
    }
  }

  return (
    <div className={classes.setup}>
      <div className={classes.header}>
        <div className={classes.loader}>
          { state.loading && (
            <Loader size={18} />
          )}
        </div>
        <div className={classes.centerTitle}>
          <Text className={classes.title}>{ state.strings.setup }</Text>
        </div>
        <div className={classes.loader}>
          { state.updating && (
            <Loader size={18} />
          )}
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.keyType}:</Text>
          <Radio.Group name="keyType" className={classes.radio} value={state.setup?.keyType} onChange={actions.setKeyType}>
            <Group mt="xs">
              <Radio disabled={state.loading} value="RSA_2048" label="RSA2048" />
              <Radio disabled={state.loading} value="RSA_4096" label="RSA4096" />
            </Group>
          </Radio.Group>
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.federatedHost}:</Text>
          <TextInput
            className={classes.value}
            size="sm"
            disabled={state.loading}
            value={state.setup?.domain || ''}
            placeholder={state.strings.urlHint}
            onChange={(event) => actions.setDomain(event.currentTarget.value)}
          />  
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.storageLimit}:</Text>
          <TextInput
            className={classes.value}
            size="sm"
            disabled={state.loading}
            value={state.accountStorage}
            placeholder={state.strings.storageHint}
            onChange={(event) => actions.setAccountStorage(event.currentTarget.value)}
          />  
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.accountCreation}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.enableOpenAccess} onChange={(ev) => actions.setEnableOpenAccess(ev.currentTarget.checked)} />
          { state.setup?.enableOpenAccess && (
            <TextInput
              className={classes.value}
              size="sm"
              disabled={state.loading}
              value={state.setup?.openAccessLimit || ''}
              placeholder={state.strings.storageHint}
              onChange={(event) => actions.setOpenAccessLimit(event.currentTarget.value)}
            />
          )}
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.enablePush}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.pushSupported} onChange={(ev) => actions.setPushSupported(ev.currentTarget.checked)} />
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.allowUnsealed}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.allowUnsealed} onChange={(ev) => actions.setAllowUnsealed(ev.currentTarget.checked)} />
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.mfaTitle}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.mfaEnabled} onChange={toggleAuth} />
        </div>
        <Divider />
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.enableImage}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.enableImage} onChange={(ev) => actions.setEnableImage(ev.currentTarget.checked)} />
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.enableAudio}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.enableAudio} onChange={(ev) => actions.setEnableAudio(ev.currentTarget.checked)} />
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.enableVideo}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.enableVideo} onChange={(ev) => actions.setEnableVideo(ev.currentTarget.checked)} />
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.enableBinary}:</Text>
          <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.enableBinary} onChange={(ev) => actions.setEnableBinary(ev.currentTarget.checked)} />
        </div>
        <Divider />
        <div className={classes.webrtc}>
          <div className={classes.option}>
            <Text className={classes.label}>{state.strings.enableWeb}:</Text>
            <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.enableIce} onChange={(ev) => actions.setEnableIce(ev.currentTarget.checked)} />
          </div>
          { state.setup?.enableIce && (
            <div className={classes.option}>
              <Text className={classes.label}>{state.strings.enableService}:</Text>
              <Switch className={classes.switch} disabled={state.loading} checked={state.setup?.iceService === 'cloudflare'} onChange={(ev) => actions.setEnableService(ev.currentTarget.checked)} />
            </div>
          )}
          { state.setup?.enableIce && state.setup?.iceService === 'cloudflare' && (
            <div className={classes.option}>
              <Text className={classes.label}>TURN_KEY_ID:</Text>
              <TextInput
                className={classes.value}
                size="sm"
                disabled={state.loading}
                value={state.setup?.iceUsername || ''}
                placeholder="KEY_ID"
                onChange={(event) => actions.setIceUsername(event.currentTarget.value)}
              />  
            </div>
          )}
          { state.setup?.enableIce && state.setup?.iceService === 'cloudflare' && (
            <div className={classes.option}>
              <Text className={classes.label}>TURN_KEY_API_TOKEN:</Text>
              <TextInput
                className={classes.value}
                size="sm"
                disabled={state.loading}
                value={state.setup?.icePassword || ''}
                placeholder="API_TOKEN"
                onChange={(event) => actions.setIcePassword(event.currentTarget.value)}
              />  
            </div>
          )}
          { state.setup?.enableIce && state.setup?.iceService === 'default' && (
            <div className={classes.option}>
              <Text className={classes.label}>{state.strings.serverUrl}:</Text>
              <TextInput
                className={classes.value}
                size="sm"
                disabled={state.loading}
                value={state.setup?.iceUrl || ''}
                placeholder={state.strings.urlHint}
                onChange={(event) => actions.setIceUrl(event.currentTarget.value)}
              />  
            </div>
          )}
          { state.setup?.enableIce && state.setup?.iceService === 'default' && (
            <div className={classes.option}>
              <Text className={classes.label}>{state.strings.webUsername}:</Text>
              <TextInput
                className={classes.value}
                size="sm"
                disabled={state.loading}
                value={state.setup?.iceUsername || ''}
                placeholder={state.strings.username}
                onChange={(event) => actions.setIceUsername(event.currentTarget.value)}
              />  
            </div>
          )}
          { state.setup?.enableIce && state.setup?.iceService === 'default' && (
            <div className={classes.option}>
              <Text className={classes.label}>{state.strings.webPassword}:</Text>
              <TextInput
                className={classes.value}
                size="sm"
                disabled={state.loading}
                value={state.setup?.icePassword || ''}
                placeholder={state.strings.password}
                onChange={(event) => actions.setIcePassword(event.currentTarget.value)}
              />  
            </div>
          )}
        </div>
      </div>
      <Modal title={state.strings.mfaTitle} opened={mfaOpened} onClose={mfaClose} overlayProps={{ backgroundOpacity: 0.55, blur: 3 }} centered>
        <div className={classes.mfa}>
          <div className={classes.secret}>
            <Text>{state.strings.mfaSteps}</Text>
            <Image radius="md" className={classes.secretImage} src={state.confirmMFAuthImage} />
            <div className={classes.secretText}>
              <Text>{state.confirmMFAuthText}</Text>
              {secretCopy && <IconCheck />}
              {!secretCopy && <IconCopy className={classes.copyIcon} onClick={copySecret} />}
            </div>
            <PinInput value={state.mfaCode} length={6} className={classes.mfaPin} onChange={(event) => actions.setMFAuthCode(event)} />
            <Text className={classes.authMessage}>{state.mfaMessage}</Text>
          </div>
          <div className={classes.control}>
            <Button variant="default" onClick={mfaClose}> 
              {state.strings.cancel}
            </Button>
            <Button variant="filled" onClick={confirmAuth} disabled={state.mfaCode.length != 6} loading={confirmingAuth}>
              {state.strings.save}
            </Button> 
          </div>
        </div>
      </Modal>
    </div>
  );
}

