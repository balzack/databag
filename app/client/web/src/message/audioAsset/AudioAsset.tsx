import React, { useState, useRef, useEffect } from 'react'
import { MediaAsset } from '../../conversation/Conversation'
import { useAudioAsset } from './useAudioAsset.hook'
import { Progress, ActionIcon, Image } from '@mantine/core'
import classes from './AudioAsset.module.css'
import { IconPlayerPlayFilled, IconPlayerPauseFilled, IconX } from '@tabler/icons-react'
import audio from '../../images/audio.png'

export function AudioAsset({ topicId, asset }: { topicId: string; asset: MediaAsset }) {
  const { state, actions } = useAudioAsset(topicId, asset)
  const [showModal, setShowModal] = useState(false)
  const [showAudio, setShowAudio] = useState(false)
  const { label } = asset.encrypted || asset.audio || { label: '' }
  const [loaded, setLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const player = useRef(null as HTMLVideoElement | null)

  const show = () => {
    setShowModal(true)
  }

  const hide = () => {
    setShowModal(false)
  }

  const play = () => {
    if (player.current) {
      player.current.play()
    }
  }

  const pause = () => {
    if (player.current) {
      player.current.pause()
    }
  }

  useEffect(() => {
    if (showModal) {
      setLoaded(false)
      setPlaying(false)
      setShowAudio(true)
      actions.loadAudio()
    } else {
      setShowAudio(false)
      actions.cancelLoad()
    }
  }, [showModal])

  return (
    <div>
      <div className={classes.asset} onClick={show}>
        <Image radius="sm" className={classes.thumb} src={audio} fit="contain" />
        <div className={classes.label}>{label}</div>
        <IconPlayerPlayFilled className={classes.play} size={32} />
      </div>

      {showModal && (
        <div className={classes.modal} style={showAudio ? { opacity: 1 } : { opacity: 0 }}>
          <div className={classes.frame}>
            <Image radius="sm" className={classes.image} src={audio} fit="contain" />
            <div className={classes.label}>{label}</div>
            {loaded && !playing && <IconPlayerPlayFilled className={classes.play} size={64} onClick={play} />}
            {loaded && playing && <IconPlayerPauseFilled className={classes.play} size={64} onClick={pause} />}
          </div>
          {state.dataUrl && (
            <div className={classes.audio}>
              <video
                ref={player}
                className={classes.image}
                controls
                src={state.dataUrl}
                playsInline={true}
                autoPlay={true}
                onLoadedData={() => setLoaded(true)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            </div>
          )}
          {state.loading && state.loadPercent > 0 && <Progress className={classes.progress} value={state.loadPercent} />}
          <ActionIcon className={classes.close} variant="filled" size="lg" onClick={hide}>
            <IconX size="lg" />
          </ActionIcon>
        </div>
      )}
    </div>
  )
}
