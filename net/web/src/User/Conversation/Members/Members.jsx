import React, { useState, useEffect, useRef } from 'react'
import { useMembers } from './useMembers.hook';

export function Members({ host, members }) {

  const { state, actions } = useMembers({ host, members });

  console.log(state);

  return (
    <div>MEMBERS</div>
  )
}

