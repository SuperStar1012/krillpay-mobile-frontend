import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useTheme } from 'contexts/ThemeContext';
import DataList from 'components/containers/DataList';

import Text from 'components/outputs/Text';

export default function InnerTabs({
  initialPage = 0,
  routes,
  config = {},
  onChangeTab,
  scrollEnabled,
  ...props
}) {
  const { colors } = useTheme();

  const { hideTabBar, screenId } = config;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(initialPage);
  useEffect(() => {
    typeof onChangeTab === 'function' && onChangeTab(index);
  }, [index]);

  function renderScene({ route }) {
    const { props = {}, component } = route ?? {};
    const { item } = props;

    if (component || item?.component) {
      const Component = component ?? item?.component;
      return <Component {...props} />;
    }

    return <DataList {...props} />;
  }

  function renderTabBar(props) {
    if (hideTabBar) return null;
    return (
      <TabBar
        {...props}
        indicatorContainerStyle={{ borderBottomWidth: 0 }}
        renderLabel={({ route }) => {
          const isActive = routes?.[index]?.key === route?.key;
          return (
            <Text
              s={14}
              c={isActive ? '#ffffff' : 'font'}
              id={route?.key}
              ns={screenId}
              numberOfLines={1}
              tA={'center'}
              w="100%"
              style={{
                backgroundColor: isActive ? colors?.primary : '#ffffff',
                borderRadius: 13,
                overflow: 'hidden',
                paddingTop: 5,
                paddingBottom: 3,
                paddingLeft: 12,
                paddingRight: 12,
                height: 26,
              }}
            />
          );
        }}
        scrollEnabled={scrollEnabled}
        // indicatorStyle={{ backgroundColor: colors?.primary }}
        renderIndicator={() => {
          return null;
        }}
        style={{
          margin: 1,
          backgroundColor: 'white',
          elevation: 0,
          shadowColor: 'transparent',
          textAlign: 'center',
        }}
      />
    );
  }

  if (hideTabBar && routes?.length === 1) {
    return renderScene({ route: routes?.[0] ?? {}, props });
  }

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
