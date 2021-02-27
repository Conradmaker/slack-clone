import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import useSWR from 'swr';
import useInput from '../../hooks/useInput';
import fetcher from '../../utils/fetcher';
import {
  Button,
  Error,
  Form,
  Header,
  Input,
  Label,
  LinkContainer,
} from '../Signup/styles';

interface LoginPropsType extends RouteComponentProps {
  [key: string]: unknown;
}

export default function Login({ history }: LoginPropsType): JSX.Element {
  const { data: userData, error, mutate } = useSWR(
    'http://localhost:8000/api/users/',
    fetcher
  );
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          'http://localhost:8000/api/users/login',
          { email, password },
          {
            withCredentials: true,
          }
        )
        .then(res => {
          //서버로 요청을 보내지 않고 데이터를 업데이트
          mutate(res.data);
        })
        .catch(e => {
          setLogInError(e.response?.data?.statusCode === 401);
        });
    },
    [email, password]
  );

  if (!error && userData) {
    history.replace('/workspace/channel/일반');
  }
  return (
    <div id="container">
      <Header>Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          {logInError && (
            <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>
          )}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
}
