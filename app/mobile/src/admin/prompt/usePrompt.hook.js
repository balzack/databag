import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function usePrompt() {

  const navigate = useNavigate();

  const [state, setState] = useState({
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    attach: () => {
    },
    login: () => {
      navigate('/login');
    }
  };

  return { state, actions };
}

