import classes from './Setup.module.css'
import { useSetup } from './useSetup.hook'
import { Radio, Group, Loader, Modal, Divider, Text, TextInput, ActionIcon } from '@mantine/core'

export function Setup() {
  const { state, actions } = useSetup();

  return (
    <div className={classes.accounts}>
      <div className={classes.content}>
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
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.keyType}:</Text>
          <Radio.Group name="keyType" className={classes.radio} disabled={state.loading} value={state.setup?.keyType} onChange={actions.setKeyType}>
            <Group mt="xs">
              <Radio value="RSA_2048" label="RSA2048" />
              <Radio value="RSA_4096" label="RSA4096" />
            </Group>
          </Radio.Group>
        </div>
        <div className={classes.option}>
          <Text className={classes.label}>{state.strings.federatedHost}:</Text>
          <TextInput
            className={classes.value}
            size="sm"
            disabled={state.loading}
            value={state.setup?.domain}
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
      </div>
    </div>
  );
}

