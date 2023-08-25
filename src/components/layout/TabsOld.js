// import React from 'react';
// import { TouchableOpacity } from 'react-native';

// import ScrollableTabView, {
//   DefaultTabBar,
//   ScrollableTabBar,
// } from 'react-native-scrollable-tab-view';
// import ScrollableTabBarAction from './ScrollableTabBar';
// import ScrollableTabBarIndicator from './ScrollableTabBarIndicator';
// import { View } from './View';
// import { Icon } from '../outputs/Icon';
// import { useTheme } from 'contexts/ThemeContext';

// const Tabs = props => {
//   const { children, initialPage, renderTabBar, onChangeTab } = props;
//   const { design, colors } = useTheme();

//   return (
//     <ScrollableTabView
//       // locked
//       style={{ borderBottomWidth: 0, zIndex: 1000 }}
//       prerenderingSiblingsNumber={1}
//       keyboardShouldPersistTaps={'handled'}
//       initialPage={initialPage}
//       onChangeTab={onChangeTab}
//       tabBarTextStyle={{
//         fontSize: 16,
//         paddingTop: 8,
//       }}
//       tabBarBackgroundColor={
//         design.app.surface ? colors.surface : colors.header
//       }
//       tabBarActiveTextColor={
//         design.app.surface ? colors.primary : colors.headerContrast
//       }
//       tabBarInactiveTextColor={'#434343'}
//       renderTabBar={() =>
//         renderTabBar ?? (
//           <DefaultTabBar
//             style={{
//               borderWidth: 0,
//             }}
//           />
//         )
//       }
//       tabBarUnderlineStyle={{
//         backgroundColor: design.app.surface
//           ? colors.primary
//           : colors.headerContrast,
//         height: 2,
//       }}>
//       {children}
//     </ScrollableTabView>
//   );
// };

// const ScrollableTabs = props => {
//   const { children, initialPage } = props;
//   const { design, colors } = useTheme();

//   return (
//     <ScrollableTabView
//       // locked
//       style={{ borderBottomWidth: 0, height: 32 }}
//       prerenderingSiblingsNumber={1}
//       keyboardDismissMode="on-drag"
//       keyboardShouldPersistTaps={true}
//       initialPage={initialPage}
//       tabBarTextStyle={{
//         fontSize: 16,
//         // paddingTop: 8,
//         color: design.app.surface ? colors.primary : colors.headerContrast,
//       }}
//       tabBarBackgroundColor={
//         design.app.surface ? colors.surface : colors.header
//       }
//       renderTabBar={() => (
//         <ScrollableTabBar
//           tabStyle={{ paddingLeft: 10, paddingRight: 10, height: 40 }}
//           style={{
//             borderWidth: 0,
//             paddingLeft: 0,
//             marginLeft: 0,
//             height: 40,
//             // borderColor:' #000000',
//           }}
//         />
//       )}
//       tabBarUnderlineStyle={{
//         backgroundColor: design.app.surface
//           ? colors.primary
//           : colors.headerContrast,
//       }}>
//       {children}
//     </ScrollableTabView>
//   );
// };

// const TabsWithAction = props => {
//   const {
//     children,
//     initialPage,
//     rightAction,
//     rightBadge,
//     rightTabs,
//     noFilter,
//   } = props;
//   const { colors, design } = useTheme();

//   const Filter = currentTab => {
//     const disabled = !rightTabs.includes(currentTab);

//     return (
//       <TouchableOpacity disabled={disabled} onPress={rightAction}>
//         <View
//           style={{
//             width: 48,
//             height: 48,
//             justifyContent: 'center',
//             alignItems: 'center',

//             // border: `1px solid grey`,
//           }}>
//           {rightBadge && !disabled ? (
//             <View
//               style={{
//                 position: 'absolute',
//                 width: 32,
//                 height: 32,
//                 top: 6,
//                 // right: 8,
//                 borderColor: colors.primary,
//                 borderRadius: 24,
//                 borderWidth: 1,
//               }}
//             />
//           ) : null}
//           <Icon
//             size={24}
//             color={disabled ? 'grey2' : 'primary'}
//             name={'filter-variant'}
//             set={'MaterialCommunityIcons'}
//           />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <ScrollableTabView
//       prerenderingSiblingsNumber={1}
//       keyboardShouldPersistTaps={'handled'}
//       initialPage={initialPage}
//       tabBarTextStyle={{
//         fontSize: 16,
//         paddingTop: 8,
//       }}
//       tabBarBackgroundColor={
//         design.app.surface ? colors.surface : colors.header
//       }
//       tabBarActiveTextColor={
//         design.app.surface ? colors.primary : colors.headerContrast
//       }
//       tabBarInactiveTextColor={'#434343'}
//       style={{
//         zIndex: 2,
//         elevation: design.app.surface ? 0 : 2,
//       }}
//       tabBarUnderlineStyle={{
//         backgroundColor: design.app.surface
//           ? colors.primary
//           : colors.headerContrast,
//         height: 2,
//       }}
//       renderTabBar={() => (
//         <ScrollableTabBarAction
//           tabsContainerStyle={{ justifyContent: 'space-around' }}
//           style={{
//             justifyContent: 'space-around',
//             borderWidth: 0,
//             shadowRadius: design.app.surface ? 0 : 1,
//             shadowOpacity: design.app.surface ? 0 : 0.15,
//             elevation: design.app.surface ? 0 : 2,
//           }}
//           rightAction={noFilter ? null : Filter}
//         />
//       )}>
//       {children}
//     </ScrollableTabView>
//   );
// };

// const TabsWithIndicator = props => {
//   const { children, initialPage, noFilter, activeTabs } = props;
//   const { design, colors } = useTheme();

//   return (
//     <ScrollableTabView
//       prerenderingSiblingsNumber={1}
//       contentProps={{ keyboardShouldPersistTaps: 'always' }}
//       keyboardShouldPersistTaps={'always'}
//       initialPage={initialPage}
//       tabBarTextStyle={{
//         fontSize: 16,
//       }}
//       tabBarBackgroundColor={
//         design.app.surface ? colors.surface : colors.header
//       }
//       tabBarActiveTextColor={
//         design.app.surface ? colors.primary : colors.headerContrast
//       }
//       tabBarInactiveTextColor={'#434343'}
//       style={{
//         zIndex: 2,
//         elevation: design.app.surface ? 0 : 2,
//       }}
//       tabBarUnderlineStyle={{
//         backgroundColor: design.app.surface
//           ? colors.primary
//           : colors.headerContrast,
//         height: 2,
//       }}
//       renderTabBar={() => (
//         <ScrollableTabBarIndicator
//           colors={colors}
//           keyboardShouldPersistTaps={'always'}
//           activeTabs={activeTabs}
//           tabsContainerStyle={{ justifyContent: 'space-around' }}
//           style={{
//             justifyContent: 'space-around',
//             borderWidth: 0,
//             shadowRadius: design.app.surface ? 0 : 1,
//             shadowOpacity: design.app.surface ? 0 : 0.15,
//             elevation: design.app.surface ? 0 : 2,
//           }}
//           rightAction={noFilter ? null : Filter}
//         />
//       )}>
//       {children}
//     </ScrollableTabView>
//   );
// };

// export { Tabs, TabsWithIndicator, TabsWithAction, ScrollableTabs };
