import { RootWrapper } from './Root.styled';
import { useRoot } from './useRoot.hook';

export function Root() {
  const root = useRoot();
  return <RootWrapper />
}
