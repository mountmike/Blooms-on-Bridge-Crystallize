import React from 'react';
import styled from 'styled-components';
import Listformat from 'components/listformat';

const Cell = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  grid-column-end: span ${(p) => p.colspan};
  grid-row-end: span ${(p) => p.rowspan};
`;

const TextCell = styled.div`
  height: 10%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  grid-column-end: span ${(p) => p.colspan};
  grid-row-end: span ${(p) => p.rowspan};
`;

export default function GridItem({ data, gridCell }) {
  const hasImage = gridCell.item.defaultVariant ? true : false

  return (
    <>
     { hasImage ?
      <Cell {...gridCell?.layout} >
        <Listformat item={data} />
      </Cell>
      :
      <TextCell {...gridCell?.layout} >
        <Listformat item={data} />
      </TextCell>
      }
    </>
   
  );
}
