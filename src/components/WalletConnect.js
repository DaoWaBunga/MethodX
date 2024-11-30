import React from 'react';
import styled from 'styled-components';

const ConnectButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.accentColor};
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Address = styled.span`
  color: ${props => props.theme.text};
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
  background: transparent;
  color: ${props => props.theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.boxBg};
  }
`;

function WalletConnect({ account, setAccount }) {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    // Clear any stored state or session data here
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return account ? (
    <WalletInfo>
      <Address>{formatAddress(account)}</Address>
      <LogoutButton onClick={disconnectWallet}>
        Logout
      </LogoutButton>
    </WalletInfo>
  ) : (
    <ConnectButton onClick={connectWallet}>
      Connect Wallet
    </ConnectButton>
  );
}

export default WalletConnect; 