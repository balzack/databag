import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const CarouselWrapper = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  height: 128px;

  .carousel {
    display: flex;
    flex-direction: row;
    padding-left: 32px;
    width: 100%;
    overflow: auto;

    /* hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .status {
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center; 
    color: #888888;
    background-color: #eeeeee;
    margin-left: 72px;
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }

  .left-arrow {
    top: calc(50% - 16px);
    height: 32px;
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    font-size: 24px;
    width: 24px;
    margin-left: 8px;
    margin-right: 8px;
    justify-content: center;
    color: ${Colors.text};
    background-color: ${Colors.profileForm};
    border-radius: 8px;
    opacity: 0.7;
  }

  .right-arrow {
    top: calc(50% - 16px);
    height: 32px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    font-size: 24px;
    width: 24px;
    margin-left: 8px;
    margin-right: 8px;
    justify-content: center;
    color: ${Colors.text};
    background-color: ${Colors.profileForm};
    border-radius: 8px;
    opacity: 0.7;
  }

  .arrow:hover {
      opacity: 1;
    }

  .item {
    margin-right: 32px;
    position: relative;
  }

  .delitem {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #888888;
    color: white;
    border-bottom-left-radius: 2px;
    cursor: pointer;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 4px;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  .asset {
    height: 128px;
    border-radius: 3px;
    overflow: hidden;
  }

  .space {
    height: 128px;
    padding-left: 4px;
  }

  .object {
    height: 100%;
    object-fit: contain;
  }
`;

