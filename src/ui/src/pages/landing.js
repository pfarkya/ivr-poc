import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  OrderedList,
  ListItem
} from 'carbon-components-react';
import { useAuth } from '../useauth'
import LandingJpg from './landing.jpg'
import Landing1Jpg from './landing1.jpg'

const props = {
  tabs: {
    selected: 0,
    triggerHref: '#',
    role: 'navigation',
  },
  tab: {
    href: '#',
    role: 'presentation',
    tabIndex: 0,
  },
};

export const LandingPage = () => {
  let auth = useAuth()
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
      <div className="bx--row landing-page__r2">
        <div className="bx--col bx--no-gutter">
          <Tabs {...props.tabs} aria-label="Tab navigation">
            <Tab {...props.tab} label="About">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-md-4 bx--col-lg-7">
                    <h2 className="landing-page__subheading">
                      What is this portal?
                    </h2>
                    <p className="landing-page__p">
                      This portal is meant for the use of distributing vaccine and get interest from the persons.It uses various technology and provide you control over automation and all.
                    </p>
                  </div>
                  <div className="bx--col-md-4 bx--offset-lg-1 bx--col-lg-8">
                    {/* <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/vaccine-6158184_1280_0_1200x768.jpeg?_zqMJHW2VAuhfdDFd2gLIi.sLLjK_Lch&size=770:433"></img> */}
                    <img src={Landing1Jpg}></img>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab {...props.tab} label="Contact Us">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-lg-16">
                  <OrderedList>
                    <ListItem>
                      Prashant
                    </ListItem>
                  </OrderedList>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};