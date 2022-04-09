import styled from 'styled-components';

export const LogoWrapper = styled.div`
  height: 48px;
  width: 48px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  .grid {
    position: relative;
    margin-left: 2px;
    margin-right: 2px;
    width: 44px;
    height: 40px;
  }   
  
  .large {
    border-radius: 18px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
   
  .medium {
    border-radius: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
    
  .small {
    border-radius: 16px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .host {
    overflow: hidden;
    border: 2px solid #88cc88;
  }

  .contact {
    overflow: hidden;
    border: 1px solid #777777;
  }

  .topleft {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .topright {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .bottomright {
    position: absolute;
    bottom: 0px;
    right: 0px;
  }

  .bottom {
    position: absolute;
    bottom: 0px;
    left: 12px;
  }
`;

export const ChannelImage = styled.img`
  width: 100%;
  height: 100%;
`;
