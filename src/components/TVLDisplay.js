import React from 'react';
import styled from 'styled-components';

const TVLBox = styled.div`
  padding: 15px;
  background: ${props => props.theme.boxBg}cc;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
`;

const TVLLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text}aa;
  margin-bottom: 5px;
`;

const TVLValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.accentColor};
`;

function TVLDisplay({ ethTVL, usdcTVL }) {
  return (
    <>
      <TVLBox>
        <TVLLabel>ETH Pool</TVLLabel>
        <TVLValue>{Number(ethTVL).toFixed(4)} ETH</TVLValue>
      </TVLBox>
      <TVLBox>
        <TVLLabel>USDC Pool</TVLLabel>
        <TVLValue>${Number(usdcTVL).toFixed(2)}</TVLValue>
      </TVLBox>
    </>
  );
}

export default TVLDisplay; 