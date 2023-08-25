import React, { useMemo } from 'react';

import { objectToArray } from 'utility/general';
import Tabs from 'components/layout/TopTabs';

export default function Page(props) {
  const { config, navigation } = props;
  const { pages } = config;
  const tabs = objectToArray(pages, 'id');

  function mapTabItems(tabs) {
    return tabs.map((tab, i) => {
      return {
        title: tab?.label,
        key: tab?.id,
        props: { item: tab },
      };
    });
  }

  const tabItems = useMemo(() => mapTabItems(tabs), tabs);

  return (
    <React.Fragment>
      <Tabs routes={tabItems} config={config} navigation={navigation} />

      {/* <Filters
          toggleFilters={toggleFilters}
          showFilters={showFilters}
          items={[
            {
              label: 'Unavailable rewards',
              onClick: () =>
                this.setState({
                  filters: { ...filters, expired: !filters.expired },
                  claimed: false,
                }),
              value: filters.expired,
            },
          ]}
        /> */}
    </React.Fragment>
  );
}
