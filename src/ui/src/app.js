import React, { Component } from 'react';
import './app.scss';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { CommonHeader} from './components/header';
import { Route, Switch, Redirect } from 'react-router-dom';
import { LandingPage } from './pages/landing';
import { LoginPage } from './pages/login';
import { CreateAgent } from './pages/createageent'
import { Reception } from './pages/receptionReal'
import { RegisterInterest } from './pages/registerinterest'
import { InventoryTable } from './pages/inventory'
import { ListAgents } from './pages/listagents'
import { ProvideAuth, useAuth } from "./useauth.js";



function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export class App extends Component {
  render() {
    return (
      <ProvideAuth>
        <CommonHeader />
        <Content>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/registerinterest" component={RegisterInterest}></Route>
            <PrivateRoute path="/createagent">
                <CreateAgent></CreateAgent>
            </PrivateRoute>
            <PrivateRoute path="/listofagent">
                <ListAgents></ListAgents>
            </PrivateRoute>
            <PrivateRoute path="/reception">
                <Reception></Reception>
            </PrivateRoute>
            <PrivateRoute path="/inventory">
                <InventoryTable></InventoryTable>
            </PrivateRoute>
          </Switch>
        </Content>
      </ProvideAuth>
    );
  }
}