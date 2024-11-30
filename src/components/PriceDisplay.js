import React from 'react';
import styled from 'styled-components';

const PriceBox = styled.div`
  padding: 15px;
  background: ${props => props.theme.boxBg}cc;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
`;

const PriceLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text}aa;
  margin-bottom: 5px;
`;

const PriceValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.accentColor};
`;

const ChangeValue = styled.div`
  font-size: 14px;
  color: ${props => props.value >= 0 ? '#4caf50' : '#f44336'};
  margin-top: 5px;
`;

function PriceDisplay({ prices }) {
  return (
    <>
      <PriceBox>
        <PriceLabel>ETH Price</PriceLabel>
        <PriceValue>${Number(prices.eth).toFixed(2)}</PriceValue>
        <ChangeValue value={0}>0%</ChangeValue>
      </PriceBox>
      <PriceBox>
        <PriceLabel>METH Price</PriceLabel>
        <PriceValue>${Number(prices.meth).toFixed(2)}</PriceValue>
        <ChangeValue value={0}>0%</ChangeValue>
      </PriceBox>
    </>
  );
}

export default PriceDisplay; 