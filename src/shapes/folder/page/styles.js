import styled from 'styled-components';
import { responsive, Outer as O } from 'ui';

export const GridHeading = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.8rem;
  padding-bottom: 8px;
  border-bottom: 1px solid grey;
`;

export const Outer = styled(O)`
  min-height: initial;
  ${responsive.mdPlus} {
    max-width: var(--content-max-width);
  }
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  // In case of not loading the media, "grid-auto-rows" will create enough space
  // in order to display the item correctly with the alternative text
  grid-auto-rows: minmax(250px, auto);

  ${responsive.smPlus} {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-auto-rows: minmax(300px, auto);
  }
`;

export const SubNavigation = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 50px;
  margin-bottom: 50px;
  ${responsive.xs} {
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: scroll;
    margin-bottom: 0;
    position: relative;
  }
`;

export const Item = styled.div`
  &.item-product {
    grid-column-end: span 1;
  }
  &.item-document {
    grid-column-end: span 2;
  }
`;
