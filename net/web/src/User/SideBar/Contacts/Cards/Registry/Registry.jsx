import React from 'react';
import { RegistryWrapper } from './Registry.styled';
import { Input } from 'antd';

export function Registry() {
  return (
    <RegistryWrapper>
      <Input.Search placeholder="Server" allowClear style={{ width: '100%' }} />
    
    </RegistryWrapper>
  );
}

