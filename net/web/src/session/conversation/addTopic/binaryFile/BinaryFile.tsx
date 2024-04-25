import { useState } from 'react';
import { Input } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { BinaryFileWrapper } from './BinaryFile.styled';

export function BinaryFile({ url, extension, label, onLabel }) {
  const [width, setWidth] = useState(0);

  return (
    <BinaryFileWrapper>
      <ReactResizeDetector
        handleWidth={false}
        handleHeight={true}
      >
        {({ height }) => {
          if (height !== width) {
            setWidth(height);
          }
          return <div style={{ height: '100%', width: width }} />;
        }}
      </ReactResizeDetector>
      <div
        className="player"
        style={{ width: width, height: width }}
      >
        <div className="extension">{extension}</div>
        <div className="label">
          <Input
            bordered={false}
            size="small"
            defaultValue={label}
            onChange={(e) => onLabel(e.target.value)}
          />
        </div>
      </div>
    </BinaryFileWrapper>
  );
}
