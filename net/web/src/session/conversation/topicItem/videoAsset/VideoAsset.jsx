import { Modal, Spin, Progress } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { VideoCameraOutlined } from '@ant-design/icons';
import { VideoAssetWrapper, VideoModalWrapper } from './VideoAsset.styled';
import { useVideoAsset } from './useVideoAsset.hook';
import { Colors } from 'constants/Colors';

export function VideoAsset({ asset }) {

  const { state, actions } = useVideoAsset(asset);

  const activate = () => {
    if (state.dimension.width / state.dimension.height > window.innerWidth / window.innerHeight) {
      let width = Math.floor(window.innerWidth * 8 / 10);
      let height = Math.floor(width * state.dimension.height / state.dimension.width);
      actions.setActive(width, height);
    }
    else {
      let height = Math.floor(window.innerHeight * 8 / 10);
      let width = Math.floor(height * state.dimension.width / state.dimension.height);
      actions.setActive(width, height);
    }
  }

  return (
    <VideoAssetWrapper>
      <ReactResizeDetector handleWidth={true} handleHeight={true}>
        {({ width, height }) => {
          if (width !== state.dimension.width || height !== state.dimension.height) {
            actions.setDimension({ width, height });
          }
          return <img style={{ height: '100%', objectFit: 'contain' }} src={asset.thumb} alt="" />
        }}
      </ReactResizeDetector>
      <div class="overlay" style={{ width: state.dimension.width, height: state.dimension.height }}>
        { !state.active && (
          <div onClick={activate}>
            <VideoCameraOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
          </div>
        )}
        <Modal centered={true} style={{ backgroundColor: '#aacc00', padding: 0 }} visible={state.active} width={state.width + 12} bodyStyle={{ paddingBottom: 0, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd', margin: 0 }} footer={null} destroyOnClose={true} closable={false} onCancel={actions.clearActive}>
          <VideoModalWrapper>
            <div class="wrapper">
              { !state.loaded && (
                  <div class="frame">
                    <img class="thumb" src={asset.thumb} alt="topic asset" />
                    { state.error && (
                      <div class="failed">
                        <Spin size="large" delay={250} />
                      </div>
                    )}
                    { !state.error && (
                      <div class="loading">
                        <Spin size="large" delay={250} />
                        { state.total !== 0 && (
                          <Progress percent={Math.floor(100 * state.block / state.total)} size="small" showInfo={false} trailColor={Colors.white} strokeColor={Colors.background} />
                        )} 
                      </div>
                    )}
                  </div>
              )}
              { !state.loading && (
                <video style={{display: state.loaded ? 'block' : 'none'}} autoplay="true" controls src={state.url} width={state.width} height={state.height} 
                    playsinline="true" onLoadedData={actions.setLoaded} />
              )}
            </div>
          </VideoModalWrapper>
        </Modal>
      </div>
    </VideoAssetWrapper>
  )
}

