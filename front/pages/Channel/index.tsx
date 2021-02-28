import React from 'react';
import Workspace from '../../layouts/Workspace';
import { Container, Header } from './styles';

export default function Channel(): JSX.Element {
  return (
    <Workspace>
      <Container>
        <Header>채널!</Header>
      </Container>
    </Workspace>
  );
}
