import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { ethers } from 'ethers';
import { darkTheme } from './theme';
import Exchange from './components/Exchange';
import GenesisSale from './components/GenesisSale';
import UniswapTrade from './components/UniswapTrade';
import WalletConnect from './components/WalletConnect';
import MethodXLogo from './components/MethodXLogo';
import ScrollingText from './components/ScrollingText';
import ScrollArrow from './components/ScrollArrow';
import HowItWorks from './components/HowItWorks';
import background1 from './assets/background1.png';
import background2 from './assets/background2.png';
import { 
  METH_CONTRACT_ADDRESS, 
  BRETT_CONTRACT_ADDRESS,
  WETH_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  GENESIS_SALE_ADDRESS,
  METH_ABI,
  BRETT_ABI,
  ERC20_ABI,
  GENESIS_SALE_ABI
} from './constants';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.account ? '0' : '20px'};
  padding-top: ${props => props.account ? '0' : '48px'};
  padding-bottom: ${props => props.account ? '0' : '48px'};
  background-image: url(${props => props.account ? background2 : background1});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: ${props => props.theme.text};
`;

const WelcomeScreen = styled.div`
  min-height: 200vh;
  position: relative;
  background-image: url(${background1});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const ContentContainer = styled.div`
  position: fixed;
  top: 100vh;
  left: 0;
  right: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  transform: translateY(${props => props.scrolled ? '-100vh' : '0'});
  transition: transform 0.8s ease-out;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

const InitialScreen = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${props => props.theme.boxBg}cc;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.borderColor};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${props => props.active ? props.theme.accentColor : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? props.theme.accentColor : props.theme.boxBg};
  }
`;

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentPage, setCurrentPage] = useState('exchange');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [contracts, setContracts] = useState({
    meth: null,
    brett: null,
    weth: null,
    usdc: null,
    genesisSale: null
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > window.innerHeight * 0.2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      };
    }
  }, []);

  useEffect(() => {
    if (account && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Initialize contracts
      const methContract = new ethers.Contract(METH_CONTRACT_ADDRESS, METH_ABI, signer);
      const brettContract = new ethers.Contract(BRETT_CONTRACT_ADDRESS, BRETT_ABI, signer);
      const wethContract = new ethers.Contract(WETH_CONTRACT_ADDRESS, ERC20_ABI, signer);
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, signer);
      const genesisSaleContract = new ethers.Contract(GENESIS_SALE_ADDRESS, GENESIS_SALE_ABI, signer);

      setContracts({
        meth: methContract,
        brett: brettContract,
        weth: wethContract,
        usdc: usdcContract,
        genesisSale: genesisSaleContract
      });
    } else {
      // Reset contracts when disconnected
      setContracts({
        meth: null,
        brett: null,
        weth: null,
        usdc: null,
        genesisSale: null
      });
    }
  }, [account]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppContainer account={account}>
        {!account ? (
          <>
            <WelcomeScreen>
              <InitialScreen>
                <ScrollArrow onClick={scrollToContent} />
              </InitialScreen>
              <ContentContainer scrolled={hasScrolled}>
                <MethodXLogo />
                <WalletConnect setAccount={setAccount} account={account} />
                <HowItWorks />
              </ContentContainer>
              <ScrollingText />
            </WelcomeScreen>
          </>
        ) : (
          <>
            <Header>
              <Nav>
                <NavButton 
                  active={currentPage === 'exchange'} 
                  onClick={() => setCurrentPage('exchange')}
                >
                  Trading Dashboard
                </NavButton>
                <NavButton 
                  active={currentPage === 'genesis'} 
                  onClick={() => setCurrentPage('genesis')}
                >
                  Genesis Sale
                </NavButton>
                <NavButton 
                  active={currentPage === 'swap'} 
                  onClick={() => setCurrentPage('swap')}
                >
                  Swap
                </NavButton>
              </Nav>
              <WalletConnect account={account} setAccount={setAccount} />
            </Header>

            {currentPage === 'exchange' && (
              <Exchange 
                account={account}
                contracts={contracts}
                provider={provider}
              />
            )}

            {currentPage === 'genesis' && (
              <GenesisSale 
                account={account}
                saleContract={contracts.genesisSale}
              />
            )}

            {currentPage === 'swap' && (
              <UniswapTrade 
                account={account}
                provider={provider}
              />
            )}
          </>
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App; 