import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(10px);
  }
  60% {
    transform: translateY(5px);
  }
`;

const ArrowContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation: ${bounce} 2s infinite;
  cursor: pointer;
`;

const Arrow = styled.div`
  width: 30px;
  height: 30px;
  border-left: 3px solid #007bff;
  border-bottom: 3px solid #007bff;
  transform: rotate(-135deg);
  opacity: 0.8;
`;

function ScrollArrow({ onClick }) {
  return (
    <ArrowContainer onClick={onClick}>
      <Arrow />
    </ArrowContainer>
  );
}

export default ScrollArrow; 