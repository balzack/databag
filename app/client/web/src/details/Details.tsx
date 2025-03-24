import React, { useState } from 'react'
import { useDetails } from './useDetails.hook'
import classes from './Details.module.css'
import {
  IconUserCog,
  IconEyeOff,
  IconAlertHexagon,
  IconMessageX,
  IconLogout2,
  IconHome,
  IconServer,
  IconShield,
  IconShieldOff,
  IconCalendarClock,
  IconExclamationCircle,
  IconX,
  IconDeviceFloppy,
  IconArrowBack,
  IconLabel,
} from '@tabler/icons-react'
import { Switch, Button, Modal, Divider, Text, TextInput, ActionIcon } from '@mantine/core'
import { Card } from '../card/Card'
import { modals } from '@mantine/modals'
import { useDisclosure } from '@mantine/hooks'

export function Details({ showClose, close }: { showClose: boolean; close: () => void }) {
  const { state, actions } = useDetails()
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [blocking, setBlocking] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [showModal, { open: setShowModal, close: clearShowModal }] = useDisclosure(false)

  const undo = () => {
    actions.undoSubject()
  }

  const save = async () => {
    if (!saving) {
      setSaving(true)
      try {
        await actions.saveSubject()
      } catch (err) {
        console.log(err)
        showError()
      }
      setSaving(false)
    }
  }

  const remove = async () => {
    modals.openConfirmModal({
      title: state.strings.confirmTopic,
      withCloseButton: false,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.sureTopic}</Text>,
      labels: { confirm: state.strings.remove, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!removing) {
          setRemoving(true)
          try {
            await actions.remove()
            close()
          } catch (err) {
            console.log(err)
            showError()
          }
          setRemoving(false)
        }
      },
    })
  }

  const leave = async () => {
    modals.openConfirmModal({
      title: state.strings.confirmLeave,
      withCloseButton: false,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.sureLeave}</Text>,
      labels: { confirm: state.strings.leave, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!removing) {
          setRemoving(true)
          try {
            await actions.leave()
            close()
          } catch (err) {
            console.log(err)
            showError()
          }
          setRemoving(false)
        }
      },
    })
  }

  const block = async () => {
    modals.openConfirmModal({
      title: state.strings.blockTopic,
      withCloseButton: false,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.blockTopicPrompt}</Text>,
      labels: { confirm: state.strings.block, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!removing) {
          setBlocking(true)
          try {
            await actions.block()
            close()
          } catch (err) {
            console.log(err)
            showError()
          }
          setBlocking(false)
        }
      },
    })
  }

  const report = async () => {
    modals.openConfirmModal({
      title: state.strings.reportTopic,
      withCloseButton: false,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.reportTopicPrompt}</Text>,
      labels: { confirm: state.strings.report, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!removing) {
          setReporting(true)
          try {
            await actions.report()
            close()
          } catch (err) {
            console.log(err)
            showError()
          }
          setReporting(false)
        }
      },
    })
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

  const cards = state.channelCards.map((card, index) => (
    <Card className={classes.card} key={index} imageUrl={card.imageUrl} name={card.name} placeholder={state.strings.name} handle={card.handle} node={card.node} actions={[]} />
  ))

  const members = state.cards
    .filter((card) => {
      if (state.detail && state.detail.members.find((member) => member.guid === card.guid)) {
        return true
      } else if (state.sealed && !card.sealable) {
        return false
      } else {
        return true
      }
    })
    .map((card, index) => {
      const enable = !state.detail
        ? []
        : [
            <Switch
              key="enable"
              className={classes.setMember}
              size="sm"
              checked={Boolean(state.detail.members.find((member) => member.guid === card.guid))}
              onChange={async (ev) => {
                try {
                  if (ev.currentTarget.checked) {
                    await actions.setMember(card.cardId)
                  } else {
                    await actions.clearMember(card.cardId)
                  }
                } catch (err) {
                  console.log(err)
                  showError()
                }
              }}
            />,
          ]

      return <Card className={classes.card} key={index} imageUrl={card.imageUrl} name={card.name} placeholder={state.strings.name} handle={card.handle} node={card.node} actions={enable} />
    })

  return (
    <div className={classes.details}>
      <div className={classes.header}>
        {showClose && <IconX className={classes.match} />}
        <Text className={classes.label}>{state.strings.details}</Text>
        {showClose && <IconX className={classes.close} onClick={close} />}
      </div>
      {state.access && (
        <div className={classes.body}>
          <div className={classes.attributes}>
            {state.host && (
              <div className={classes.subject}>
                <div className={classes.subjectLabel}>
                  <TextInput
                    size="lg"
                    placeholder={state.strings.subject}
                    value={state.editSubject}
                    onChange={(event) => actions.setEditSubject(event.currentTarget.value)}
                    leftSectionPointerEvents="none"
                    leftSection={<IconLabel />}
                    rightSectionPointerEvents="all"
                    rightSectionWidth={64}
                    rightSection={
                      <div className={classes.subjectControls}>
                        {state.editSubject != state.subject && (
                          <ActionIcon key="undo" variant="subtle" onClick={undo}>
                            <IconArrowBack />
                          </ActionIcon>
                        )}
                        {state.editSubject != state.subject && (
                          <ActionIcon key="save" variant="subtle" onClick={save} loading={saving}>
                            <IconDeviceFloppy />
                          </ActionIcon>
                        )}
                      </div>
                    }
                  />
                </div>
              </div>
            )}
            {!state.host && state.subject && (
              <div className={classes.attribute}>
                <IconLabel size={28} className={classes.subjectValue} />
                <Text className={classes.subjectValue}>{state.subject}</Text>
              </div>
            )}
            {!state.host && !state.subject && (
              <div className={classes.attribute}>
                <IconLabel size={28} className={classes.subjectPlaceholder} />
                <Text className={classes.subjectPlaceholder}>{state.strings.subject}</Text>
              </div>
            )}
            <div className={classes.attribute}>
              <IconCalendarClock size={20} />
              <Text className={classes.attributeValue}>{state.created}</Text>
            </div>
            {state.sealed && (
              <div className={classes.attribute}>
                <IconShield size={20} />
                <Text className={classes.attributeValue}>{state.strings.sealed}</Text>
              </div>
            )}
            {!state.sealed && (
              <div className={classes.attribute}>
                <IconShieldOff size={20} />
                <Text className={classes.attributeValue}>{state.strings.notSealed}</Text>
              </div>
            )}
            {state.host && (
              <div className={classes.attribute}>
                <IconHome size={20} />
                <Text className={classes.attributeValue}>{state.strings.channelHost}</Text>
              </div>
            )}
            {!state.host && (
              <div className={classes.attribute}>
                <IconServer size={20} />
                <Text className={classes.attributeValue}>{state.strings.channelGuest}</Text>
              </div>
            )}
          </div>
          <Divider className={classes.divider} />
          {!state.host && (
            <div className={classes.actions}>
              <div className={classes.action}>
                <ActionIcon variant="subtle" size={32} loading={removing} onClick={leave}>
                  <IconLogout2 size={32} />
                </ActionIcon>
                <Text className={classes.actionLabel}>{state.strings.leave}</Text>
              </div>
              <div className={classes.action}>
                <ActionIcon variant="subtle" size={32} loading={blocking} onClick={block}>
                  <IconEyeOff size={32} />
                </ActionIcon>
                <Text className={classes.actionLabel}>{state.strings.block}</Text>
              </div>
              <div className={classes.action}>
                <ActionIcon variant="subtle" size={32} loading={reporting} onClick={report}>
                  <IconAlertHexagon size={32} />
                </ActionIcon>
                <Text className={classes.actionLabel}>{state.strings.report}</Text>
              </div>
            </div>
          )}
          {state.host && (
            <div className={classes.actions}>
              <div className={classes.action}>
                <ActionIcon variant="subtle" size={32} loading={removing} onClick={remove}>
                  <IconMessageX size={32} />
                </ActionIcon>
                <Text className={classes.actionLabel}>{state.strings.remove}</Text>
              </div>
              <div className={classes.action}>
                <ActionIcon variant="subtle" size={32} onClick={setShowModal}>
                  <IconUserCog size={32} />
                </ActionIcon>
                <Text className={classes.actionLabel}>{state.strings.members}</Text>
              </div>
            </div>
          )}
          <div className={classes.membership}>
            <Text className={classes.members}>{state.strings.membership}</Text>
          </div>
          <Divider className={classes.divider} size="md" />
          <div className={classes.cards}>
            {state.hostCard && (
              <Card
                className={classes.card}
                imageUrl={state.hostCard.imageUrl}
                name={state.hostCard.name}
                placeholder={state.strings.name}
                handle={state.hostCard.handle}
                node={state.hostCard.node}
                actions={[<IconHome key="host" size={20} />]}
              />
            )}
            {state.profile && (
              <Card
                className={classes.card}
                imageUrl={state.profile.imageUrl}
                name={state.profile.name}
                placeholder={state.strings.name}
                handle={state.profile.handle}
                node={state.profile.node}
                actions={state.host ? [<IconHome key="me" size={20} />] : []}
              />
            )}
            {cards}
            {state.unknownContacts > 0 && (
              <Text className={classes.unknown}>
                {state.strings.unknown}: {state.unknownContacts}
              </Text>
            )}
          </div>
        </div>
      )}
      {!state.access && (
        <div className={classes.disconnected}>
          <IconExclamationCircle />
          <Text>{state.strings.syncError}</Text>
        </div>
      )}
      <Modal title={state.strings.editMembership} opened={showModal} onClose={clearShowModal} overlayProps={{ backgroundOpacity: 0.65, blur: 3 }} centered>
        <div className={classes.modalContainer}>
          {members.length > 0 && <div className={classes.cardMembers}>{members}</div>}
          {members.length === 0 && (
            <div className={classes.noContacts}>
              <Text>{state.strings.noContacts}</Text>
            </div>
          )}
          <div className={classes.controls}>
            <Button variant="default" onClick={clearShowModal}>
              {state.strings.close}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
