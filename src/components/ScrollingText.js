import React from 'react';
import styled, { keyframes } from 'styled-components';

const scroll = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const ScrollContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 8px 0;
  overflow: hidden;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ScrollingContent = styled.div`
  display: flex;
  animation: ${scroll} 30s linear infinite;
`;

const Text = styled.span`
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  padding-left: 50px;
`;

function ScrollingText() {
  const message = "MethodX: Hold Meth to earn Brett on every buy and sell made by others, or earn on every buy and sell you make too!  MethodX: Hold Meth to earn Brett on every buy and sell made by others, or earn on every buy and sell you make too!  ";

  return (
    <ScrollContainer>
      <ScrollingContent>
        <Text>{message}</Text>
        <Text>{message}</Text> {/* Duplicate the message to ensure continuous scroll */}
      </ScrollingContent>
    </ScrollContainer>
  );
}

export default ScrollingText;
