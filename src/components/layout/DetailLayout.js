/* eslint-disable import/namespace */
import React from 'react';
import * as Inputs from 'config/inputs';

import { View } from 'components';
// import { Output, View } from 'components';
import { renderCountry, concatAddress } from 'utility/general';
import { Icon } from 'components/outputs/Icon';
import ButtonList from 'components/inputs/ButtonList';
import Output from 'components/outputs/OutputNew';

export default function DetailLayout(props) {
  const { type, item, profileConfig, setState, methods, configs } = props;
  const canVerify = Boolean(configs?.verify ?? false);

  const keys = Object.keys(Inputs?.[type] ?? {});
  let incomplete = false;
  let empty = true;
  let outputs = [];

  if (!item) return null;
  if (type === 'profile') {
    empty = false;
    outputs = keys.map(key => {
      if (
        key !== 'primary' &&
        !(key === 'id_number' && profileConfig?.hideID)
      ) {
        const label = key ?? '';
        const value = key.match(/country|nationality/)
          ? renderCountry(item[key])
          : item[key]
          ? item[key]
          : 'Not yet provided';
        return { label, value };
      }
    });
  } else {
    outputs = keys.map(key => {
      if (key !== 'primary') {
        const label = key;
        const value = key.match(/country|nationality/)
          ? renderCountry(item[key])
          : item[key];
        if (!value) {
          incomplete = true;
        } else {
          empty = false;
        }
        return { label, value };
      }
    });
    if (type === 'bank_account') {
      outputs.push({
        label: 'address',
        value: concatAddress(item?.branch_address),
      });
    }
  }

  const { handleDelete, handleVerify, handlePrimary, loading } = methods;

  let buttons = [];
  if (type.match(/email|mobile/)) {
    // if (!item?.primary)
    //   buttons.push({
    //     id: 'primary',
    //     onPress: handlePrimary,
    //     loading: loading === 'primary',
    //   });
    if (!item?.verified)
      buttons.push({
        id: 'verify',
        onPress: handleVerify,
        loading: loading === 'verify',
      });
  } else {
    buttons.push({ id: 'edit', onPress: () => setState('form') });
  }
  if (!item?.primary)
    buttons.push({
      id: 'delete',
      type: 'text',
      color: 'error',
      onPress: handleDelete,
      loading: loading === 'delete',
    });

  return (
    <View bC={'surfaceCard'} pt={0.1}>
      <View fD="row" aI="flex-end">
        <View f={1}>
          {outputs.map((field, index) => {
            if (!field) {
              return null;
            }
            if (field.label === 'currencies') {
              //TODO: map of currencies
              if (field.value.length && field.value.length > 0) {
                return (
                  <Output
                    placeholder="Not yet provided"
                    key={index.toString()}
                    label={field.label}
                    value={field.value.map(
                      (item, ind) => (ind > 0 ? ', ' : '') + item.display_code,
                    )}
                  />
                );
              } else {
                return null;
              }
            }
            return field && field.value ? (
              <Output
                key={index.toString()}
                label={field.label}
                value={field.value}
              />
            ) : null;
          })}
        </View>
        {canVerify && (
          <View fD="row" pr={0} pb={0.5}>
            {item?.verified ? (
              <Icon
                style={{ paddingLeft: 8 }}
                name="done"
                color="positive"
                size={20}
                set={'MaterialIcons'}
              />
            ) : (
              <Icon
                style={{ paddingLeft: 8 }}
                name="close"
                color="negative"
                size={20}
                set={'MaterialIcons'}
              />
            )}
            {item?.primary ? (
              <Icon
                style={{ paddingLeft: 8 }}
                name="star"
                color="primary"
                size={20}
                set={'MaterialIcons'}
              />
            ) : (
              <Icon
                style={{ paddingLeft: 8 }}
                name="star-border"
                color="font"
                size={20}
                set={'MaterialIcons'}
              />
            )}
          </View>
        )}
      </View>
      <ButtonList pt={1.375} items={buttons} />
    </View>
  );
}
