import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'

export function AudioAsset({ label, audioUrl }) {

  return <ReactPlayer height="100%" width="auto" controls="true" url={audioUrl} />
}

