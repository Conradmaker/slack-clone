import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
const Login = React.lazy(() => import('@pages/Login'));
const Signup = React.lazy(() => import('@pages/Signup'));
const Channel = React.lazy(() => import('@pages/Channel'));
const DirectMessage = React.lazy(() => import('@pages/DirectMessage'));

const App: React.FC = () => {
  return (
    <Switch>
      <Suspense fallback={<div>로딩중</div>}>
        <Route exact path="/" render={() => <div>1</div>} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/workspace/channel/:name" component={Channel} />
        <Route path="/workspace/dm/:name" component={DirectMessage} />
      </Suspense>
    </Switch>
  );
};
export default App;
