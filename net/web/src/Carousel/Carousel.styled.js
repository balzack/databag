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
    padding-left: 16px;
    width: 100%;
    overflow: hidden;

    /* hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }

  .arrows {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
  }

  .arrow {
    height: 50%;
    background-color: #888888;
    color: white;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    padding-left: 2px;
    padding-right: 2px;
    cursor: pointer;
  }

  .asset {
    height: 128px;
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

