import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useTheme } from 'contexts/ThemeContext';
import DataList from 'components/containers/DataList';

import Text from 'components/outputs/Text';
import { View } from './View';

export default function Tabs(props) {
  const {
    initialPage = 0,
    routes,
    config = {},
    onChangeTab,
    ...restProps
  } = props;

  const { colors } = useTheme();

  const { hideTabBar } = config;

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
      return <Component {...restProps} {...props} />;
    }

    return <DataList {...restProps} {...props} />;
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
              s={16}
              c={isActive ? 'primary' : 'fontDark'}
              fW={isActive ? 'bold' : 'normal'}
              id={route?.key}
              numberOfLines={1}
              tA={'center'}
              w="100%"
            />
          );
        }}
        // indicatorStyle={{ backgroundColor: colors?.primary }}
        renderIndicator={() => {
          return null;
        }}
        tabStyle={{
          paddingHorizontal: 10,
          paddingVertical: 15,
        }}
        style={{
          margin: 0,
          backgroundColor: 'white',
          elevation: 0,
          shadowColor: 'transparent',
          textAlign: 'center',
        }}
      />
    );
  }

  if (hideTabBar && routes?.length === 1) {
    return renderScene({ route: routes?.[0] ?? {}, restProps });
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

//   // return (
//   //   <ScrollableTabView
//   //     // locked
//   //     style={{ borderBottomWidth: 0, zIndex: 1000 }}
//   //     prerenderingSiblingsNumber={1}
//   //     keyboardShouldPersistTaps={'handled'}
//   //     initialPage={initialPage}
//   //     onChangeTab={onChangeTab}
//   //     tabBarTextStyle={{
//   //       fontSize: 16,
//   //       paddingTop: 8,
//   //     }}
//   //     tabBarBackgroundColor={
//   //       design.app.surface ? colors.surface : colors.header
//   //     }
//   //     tabBarActiveTextColor={
//   //       design.app.surface ? colors.primary : colors.headerContrast
//   //     }
//   //     tabBarInactiveTextColor={'#434343'}
//   //     renderTabBar={() =>
//   //       renderTabBar ?? (
//   //         <DefaultTabBar
//   //           style={{
//   //             borderWidth: 0,
//   //           }}
//   //         />
//   //       )
//   //     }
//   //     tabBarUnderlineStyle={{
//   //       backgroundColor: design.app.surface
//   //         ? colors.primary
//   //         : colors.headerContrast,
//   //       height: 2,
//   //     }}>
//   //     {children}
//   //   </ScrollableTabView>
//   // );
