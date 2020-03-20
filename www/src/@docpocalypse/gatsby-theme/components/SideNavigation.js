import React from 'react';
import sortBy from 'lodash/sortBy';
import SideNavigation, {
  usePageData,
} from '@docpocalypse/gatsby-theme/src/components/SideNavigation';

function AppSideNavigation(props) {
  const { api } = usePageData();

  return (
    <SideNavigation.Panel {...props}>
      <nav>
        <ul>
          <SideNavigation.Item>
            <SideNavigation.Link to="/getting-started">
              Getting Started
            </SideNavigation.Link>
          </SideNavigation.Item>
          <SideNavigation.Item>
            <SideNavigation.Link to="/controllables">
              Controlled Components
            </SideNavigation.Link>
          </SideNavigation.Item>
          <SideNavigation.Item>
            <SideNavigation.Header>API</SideNavigation.Header>
            <ul className="mb-4">
              {sortBy(api, 'title').map(page => (
                <SideNavigation.Item key={page.title}>
                  <SideNavigation.Link to={page.path}>
                    {page.title}
                  </SideNavigation.Link>
                </SideNavigation.Item>
              ))}
            </ul>
          </SideNavigation.Item>
        </ul>
      </nav>
    </SideNavigation.Panel>
  );
}

export default AppSideNavigation;
