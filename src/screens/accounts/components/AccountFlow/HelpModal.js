import React from 'react';
import { PopUpGeneral, Text, View } from 'components';

export default function HelpModal(props) {
  const { config = {}, modalVisible, hideModal, showModal } = props;

  const { help = {} } = config;
  const { items = [] } = help;

  function handleDismiss() {
    hideModal();
  }

  if (!Boolean(modalVisible)) return null;

  return (
    <PopUpGeneral
      visible={Boolean(modalVisible)}
      onDismiss={handleDismiss}
      title={'help'}
      showClose>
      {/* <Text tA="center" s={20} p={1} c="primary">
        {'Help'}
      </Text> */}
      {Boolean(items?.length > 0) &&
        items.map(item => {
          const { title, description, condition } = item;
          if (
            !condition ||
            (typeof condition === 'function' && condition(props))
          )
            return (
              <View key={item?.id} p={0.5}>
                <View pv={0.5}>
                  <Text fW="bold" id={title} />
                </View>
                <Text id={description} />
              </View>
            );
          return null;
        })}
    </PopUpGeneral>
  );
}
