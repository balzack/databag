import React from 'react'
import { Image } from '@mantine/core'
import classes from './Channel.module.css'
import { Colors } from '../constants/Colors'

export function Channel({
  className,
  unread,
  focused,
  imageUrl,
  notesPlaceholder,
  subject,
  subjectPlaceholder,
  message,
  messagePlaceholder,
  select,
}: {
  className: string
  unread: boolean
  focused: boolean
  imageUrl: string
  notesPlaceholder: string
  subject: (string | null)[]
  subjectPlaceholder: string
  message: string
  messagePlaceholder: string
  select?: () => void
}) {
  const title = subject.length ? (
    subject.map((part, index) =>
      part ? (
        <span key={index} className={classes.known}>
          {part + (index + 1 < subject.length ? ', ' : '')}
        </span>
      ) : (
        <span key={index} className={classes.unknown}>
          {subjectPlaceholder + (index + 1 < subject.length ? ', ' : '')}
        </span>
      )
    )
  ) : (
    <span className={classes.notes}>{notesPlaceholder}</span>
  )

  return (
    <div className={className}>
      <div className={classes.channel}>
        <div className={focused ? classes.focused : classes.unfocused}>
          <div className={select ? classes.cursor : classes.nocursor} onClick={select ? select : () => {}}>
            <Image radius="sm" className={classes.image} src={imageUrl} />
            <div className={classes.details}>
              <span className={classes.subject}>{title}</span>
              {message != null && <span className={classes.messageSet}>{message}</span>}
              {message == null && <span className={classes.messageUnset}>{messagePlaceholder}</span>}
            </div>
            {unread && <div className={classes.unread} style={{ backgroundColor: Colors.connected }} />}
          </div>
        </div>
      </div>
    </div>
  )
}
