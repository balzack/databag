import { useCopyButton } from './useCopyButton.hook';
import { Tooltip, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

export function CopyButton({ onCopy }) {
  const { state, actions } = useCopyButton();

  return (
    <Tooltip
      color={state.color}
      title={state.message}
      trigger={[]}
      open={state.show}
      placement="topRight"
    >
      <Button
        icon={<CopyOutlined />}
        size="small"
        onClick={() => actions.copy(onCopy)}
      />
    </Tooltip>
  );
}
