import React from 'react';
import { View, Text } from 'components';
import SettingsOverviewItem from './SettingsOverviewItem';

export default function SettingsOverviewSection(props) {
  const { navigation, id, context, children = {}, showModal } = props;
  const {
    viewStyleContainer,
    viewStyleChildren,
    viewStyleLabel,
    textStyleLabel,
  } = styles;

  const keys = Object.keys(children).filter(({ condition }) =>
    typeof condition === 'function' ? condition(context) : true,
  );

  return (
    <View style={viewStyleContainer} ph={1.5}>
      <View style={viewStyleLabel}>
        <Text id={id} fW="500" s={18}>
          {/* {label} */}
        </Text>
      </View>
      {/* {children} */}
      <View style={[viewStyleChildren]}>
        {keys.map(key => {
          const item = children?.[key];
          const { value, status, renderItem, label, condition } = item;
          const { items: data } = context?.[key] ?? {};

          if (renderItem) {
            return renderItem({
              key,
              data,
              item,
              context,
            });
          }
          const hide = typeof condition === 'function' && !condition(context);
          if (hide) return null;
          return (
            <SettingsOverviewItem
              {...item}
              showModal={showModal}
              id={key}
              key={key}
              hide={hide}
              label={id}
              navigation={navigation}
              // value={
              //   typeof value === 'function'
              //     ? value(data)
              //     : get(data, value, value)
              // }
              // status={
              //   typeof status === 'function'
              //     ? status(data ?? props)
              //     : get(data, status, status)
              // }
              // onClick={() => handleStateChange(key)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = {
  viewStyleContainer: {
    flexDirection: 'column',
    padding: 8,
  },
  viewStyleLabel: {
    flexDirection: 'row',
    // borderBottomWidth: 2,
    marginBottom: 8,
    paddingBottom: 4,
    borderColor: 'lightgrey',
    paddingTop: 8,
  },
  viewStyleChildren: {
    flexDirection: 'column',
  },
};
