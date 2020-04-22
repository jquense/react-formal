import React from 'react';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import SideNavigation, {
  usePageData,
} from '@docpocalypse/gatsby-theme/src/components/SideNavigation';

function AppSideNavigation(props) {
  const { api } = usePageData();

  const groupedByMembers = groupBy(
    api,
    (doc) => doc.tags.find((t) => t.name === 'memberof')?.value || 'none',
  );

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
            <SideNavigation.Link to="/migration-v2">
              Migrating to v2
            </SideNavigation.Link>
          </SideNavigation.Item>
          <SideNavigation.Item>
            <SideNavigation.Header>API</SideNavigation.Header>
            <ul className="mb-4">
              {sortBy(api, 'title')
                .filter((n) => !n.tags.find((t) => t.name === 'memberof'))
                .map((page) => (
                  <SideNavigation.Item key={page.title}>
                    <SideNavigation.Link to={page.path}>
                      {page.title}
                      {groupedByMembers[page.title] && (
                        <ul>
                          {sortBy(groupedByMembers[page.title], 'title').map(
                            (sub) => (
                              <SideNavigation.Item key={sub.title}>
                                <SideNavigation.Link to={sub.path}>
                                  {sub.title}
                                </SideNavigation.Link>
                              </SideNavigation.Item>
                            ),
                          )}
                        </ul>
                      )}
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
