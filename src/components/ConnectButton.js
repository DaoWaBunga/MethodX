import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.accentColor};
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const AddressText = styled.span`
  color: ${props => props.theme.text};
`;

function ConnectButton({ account, onConnect }) {
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Button onClick={onConnect}>
      {account ? (
        <AddressText>{formatAddress(account)}</AddressText>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
}

export default ConnectButton; 