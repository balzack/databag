import { createContext } from 'react';
import { useArticleContext } from './useArticleContext.hook';

export const ArticleContext = createContext({});

export function ArticleContextProvider({ children }) {
  const { state, actions } = useArticleContext();
  return (
    <ArticleContext.Provider value={{ state, actions }}>
      {children}
    </ArticleContext.Provider>
  );
}

