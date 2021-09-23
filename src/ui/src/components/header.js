import React from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';
import Notification20 from '@carbon/icons-react/lib/notification/20';
import UserAvatar20 from '@carbon/icons-react/lib/user--avatar/20';
import AppSwitcher20 from '@carbon/icons-react/lib/app-switcher/20';
import { Logout32 } from '@carbon/icons-react'
import { Link } from 'react-router-dom';
import { useAuth } from '../useauth'


export const CommonHeader = () => {
let auth = useAuth()
let signout = () => {
    auth.signout()
}
return (
  <Header aria-label="Reach the Unreached">
    <SkipToContent />
    <HeaderName element={Link} to="/" prefix="">
      Reach the Unreached
    </HeaderName>
    {!auth.user && <HeaderNavigation aria-label="Reach the unreach">
      <HeaderMenuItem element={Link} to="/login">
        Login
      </HeaderMenuItem>
      <HeaderMenuItem element={Link} to="/registerinterest">
        Register Interest
      </HeaderMenuItem>
    </HeaderNavigation>}
    { auth.user && auth.user.role !== "admin" && <HeaderNavigation aria-label="">
      <HeaderMenuItem element={Link} to="/registerinterest">
        Register Interest
      </HeaderMenuItem>
      <HeaderMenuItem element={Link} to="/reception">
        Reception
      </HeaderMenuItem>
    </HeaderNavigation>
    }
    { auth.user && auth.user.role === "admin" && <HeaderNavigation aria-label="">
      <HeaderMenuItem element={Link} to="/createagent">
        Create Agent
      </HeaderMenuItem>
      <HeaderMenuItem element={Link} to="/listofagent">
        List of Agents
      </HeaderMenuItem>
      <HeaderMenuItem element={Link} to="/inventory">
        Vaccine
      </HeaderMenuItem>
    </HeaderNavigation>
    }
    {auth.user && <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="Logout" onClick={signout}>
        <Logout32 />
      </HeaderGlobalAction>
    </HeaderGlobalBar>}
  </Header>
)
};
