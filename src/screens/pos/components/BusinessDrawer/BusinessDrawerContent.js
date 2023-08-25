import React from 'react';

import { View, Button, Text, CustomIcon } from 'components';
import Logo from 'components/outputs/Logo';
import BusinessSelector from './BusinessSelector';
import { useRehiveContext } from 'contexts';

function BusinessDrawerContent(props) {
  const { hideDrawer } = props;
  const { company } = useRehiveContext();
  const companyName = company?.name;

  return (
    <React.Fragment>
      <View fD="row" h="100%" bC="white">
        <View f={1} fD="column" bC="#ffffff" ml={2} mr={1}>
          <View aI="flex-end" mt={0.75}>
            <Button
              // disabled={hideSessions}
              t={'text'}
              onPress={hideDrawer}
              containerStyle={{ width: 32 }}>
              <CustomIcon
                name={'close'}
                size={20}
                padded
                contained={false}
                color="font"
              />
            </Button>
          </View>
          <Logo height={40} company={company} />
          <Text s={20} fW="bold" style={{ marginTop: 20 }}>
            {companyName}
          </Text>
          <View pt={1.5}>
            <BusinessSelector />
          </View>
        </View>
      </View>
      {/* {renderModal()} */}
    </React.Fragment>
  );
}

export default React.memo(BusinessDrawerContent);
