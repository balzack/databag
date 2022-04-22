import styled from 'styled-components';

export const CarouselWrapper = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  height: 128px;
  margin-top: 16px;

  .carousel {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-left: 16px;
    overflow: hidden;

    /* hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }

  .arrows {
    width: 128px;
    display: flex;
    flex-direction: row;
    position: absolute;
    left: calc(50% - 64px);
    justify-content: center;
    bottom: 8px;
  }

  .arrow {
    background-color: #888888;
    color: white;
    opacity: 0.8;
    padding-left: 4px;
    padding-right: 4px;
    margin-left: 8px;
    margin-right: 8px;
    font-size: 20px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid white;
  }

  .arrow:hover {
      opacity: 1;
    }

  .item {
    height: 128px;
    margin-right: 32px;
  }

  .space {
    height: 128px;
    padding-left: 100%;
  }

  .object {
    height: 100%;
    object-fit: contain;
  }
`;

