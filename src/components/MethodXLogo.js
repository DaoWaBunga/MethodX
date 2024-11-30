import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% {
    transform: translateY(0px) rotateY(0deg);
  }
  50% {
    transform: translateY(-20px) rotateY(10deg);
  }
  100% {
    transform: translateY(0px) rotateY(0deg);
  }
`;

const LogoContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    animation: ${float} 2s ease-in-out infinite;
  }
`;

const Text3D = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #007bff;
  text-shadow: 
    0 1px 0 #ccc,
    0 2px 0 #c9c9c9,
    0 3px 0 #bbb,
    0 4px 0 #b9b9b9,
    0 5px 0 #aaa,
    0 6px 1px rgba(0,0,0,.1),
    0 0 5px rgba(0,0,0,.1),
    0 1px 3px rgba(0,0,0,.3),
    0 3px 5px rgba(0,0,0,.2),
    0 5px 10px rgba(0,0,0,.25),
    0 10px 10px rgba(0,0,0,.2),
    0 20px 20px rgba(0,0,0,.15);
  
  background: linear-gradient(45deg, #007bff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

function MethodXLogo() {
  return (
    <LogoContainer>
      <Text3D>MethodX</Text3D>
    </LogoContainer>
  );
}

export default MethodXLogo; 