import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useCarousel() {
  const [state, setState] = useState({});

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const navigate = useNavigate();

  const actions = {};

  return { state, actions };
}
