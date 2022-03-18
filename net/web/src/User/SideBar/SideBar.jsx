import React from 'react'
import { SideBarWrapper } from './SideBar.styled';
import { Identity } from './Identity/Identity';
import { Contacts } from './Contacts/Contacts';

export function SideBar() {

  return (
    <SideBarWrapper>
      <Identity />
      <Contacts />
    </SideBarWrapper>
  )
}
