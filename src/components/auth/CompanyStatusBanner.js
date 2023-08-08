/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, Text } from 'components';
import { Icon } from 'components/outputs/Icon';
// import { StatusBar } from 'expo-status-bar';
// import { useTheme } from 'components/context';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from '../../screens/auth/redux/selectors';

export default function CompanyStatusBanner(props) {
  let { company } = props;
  // const { colors } = useTheme();
  const [dimensions, setDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const companyRedux = useSelector(currentCompanySelector);
  const { mode = '' } = company ?? companyRedux ?? {};
  const isTestCompany = Boolean(mode.match(/test/));
  const isSuspendedCompany = Boolean(mode.match(/suspended/));
  const showBanner = isTestCompany || isSuspendedCompany;

  // useEffect(() => {
  //   StatusBar.setStatusBarBackgroundColor(
  //     isSuspendedCompany
  //       ? colors?.error
  //       : isTestCompany
  //       ? colors?.warning
  //       : 'auto',
  //   );
  // }, [isSuspendedCompany, isTestCompany]);

  if (!showBanner || !mode) {
    return null;
  }

  return (
    showBanner && (
      <View
        w={'100%'}
        style={{ position: 'relative' }}
        onLayout={event => {
          setDimensions(event.nativeEvent.layout);
        }}>
        {/* <StatusBar
          backgroundColor={
            isSuspendedCompany
              ? colors?.error
              : isTestCompany
              ? colors?.warning
              : 'auto'
          }
        /> */}
        {/* <View
          pos="absolute"
          bC={isSuspendedCompany ? 'error' : 'warning'}
          o={0.2}
          w={'100%'}
          h={dimensions?.height ?? 46}></View>

        <View p={0.25} pr={2} ph={1.5} fD="row" jC="center">
          <View ph={0.125}>
            <Icon
              circled={false}
              name={isSuspendedCompany ? 'error' : 'warning'}
              set="MaterialIcons"
              size={24}
              color={isSuspendedCompany ? 'error' : 'warning'}
            />
          </View>
          <Text tA="center" w="auto">
            <Text
              fW="bold"
              c={isSuspendedCompany ? 'error' : 'warning'}
              width="auto"
              id={isSuspendedCompany ? 'alert_prefix' : 'warning_prefix'}
            />
            <Text
              c={isSuspendedCompany ? 'error' : 'warning'}
              width="auto"
              id={
                isSuspendedCompany
                  ? 'suspended_company_banner'
                  : isTestCompany
                  ? 'test_company_banner'
                  : ''
              }
            />
          </Text> 
        </View> */}
      </View>
    )
  );
}
