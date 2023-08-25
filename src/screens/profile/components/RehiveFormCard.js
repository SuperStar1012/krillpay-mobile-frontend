import React, { Component } from 'react';
import * as Inputs from 'config/inputs';

import { Output, View, Card, Text } from 'components';
import { RehiveForm } from './RehiveForm';
import { safe, renderCountry } from 'utility/general';
import { CardLayout } from 'components/card';
import context from 'components/context';
import { resendVerification } from 'utility/rehive';
import { BankAccountForm } from 'components/form/BankAccountForm';
import { AddressForm } from '../../../components/form/AddressForm';

class _RehiveFormCard extends Component {
  actionOne(item, index) {
    const { type, detailObj } = this.props;
    let label = '';
    let onPress = () => {};
    let disabled = false;
    if (!detailObj.visible) {
      switch (type) {
        case 'mobile':
        case 'email':
          label = item.primary ? 'Primary' : 'MAKE PRIMARY';
          onPress = () => this.props.showModal('primary', index);
          disabled = item.primary ? true : false;
          break;
        default:
      }
    }
    return {
      label,
      onPress,
      disabled,
    };
  }

  actionTwo(item, index) {
    const { type, company, detailObj } = this.props;
    let label = '';
    let onPress = () => {};
    let disabled = false;

    if (!detailObj.visible) {
      switch (type) {
        case 'mobile':
        case 'email':
          label = item && item.verified ? 'Verified' : 'VERIFY';
          onPress = () => {
            try {
              resendVerification(type, item, company);
            } catch (e) {
              console.log(e);
            }
            this.props.showModal('verify', index);
          };
          disabled = item && item.verified ? true : false;
          break;
        default:
      }
    }
    return {
      label,
      onPress,
      disabled,
    };
  }

  editable() {
    const { type } = this.props;

    switch (type) {
      case 'mobile':
      case 'email':
        return false;
      default:
        return true;
    }
  }

  actionFooter(item, index) {
    const { type, detailObj } = this.props;
    let icon = '';
    let onPress = () => {};
    let disabled = false;

    if (!detailObj.visible) {
      switch (type) {
        case 'mobile':
        case 'email':
          if (item.primary) {
            icon = '';
          } else {
            icon = 'delete';
          }
          break;
        case 'profile':
          icon = '';
          break;
        case 'address':
        case 'bank_account':
        case 'crypto_address':
        default:
          icon = 'delete';
          break;
      }
    }
    if (icon === 'delete') {
      onPress = () => this.props.showModal('delete', index);
    }
    return {
      icon,
      onPress,
      disabled,
    };
  }

  render() {
    const {
      type,
      item,
      index,
      onSaveSuccess,
      detailObj,
      design,
      profileConfig,
      currencies,
    } = this.props;

    if (detailObj.visible) {
      return (
        <View scrollView>
          <Card
            onPressContentDisabled
            design={design.settings}
            removeDefaultContainerStyle={true}>
            {type === 'bank_account' ? (
              <BankAccountForm
                accounts={currencies}
                item={item}
                onDetailClose={detailObj.hideDetail}
                onSaveSuccess={onSaveSuccess}
              />
            ) : type === 'address' ? (
              <AddressForm
                profileConfig={profileConfig}
                item={item}
                onDetailClose={detailObj.hideDetail}
                onSaveSuccess={() => onSaveSuccess('address')}
              />
            ) : (
              <RehiveForm
                profileConfig={profileConfig}
                type={type}
                initial={item}
                onDetailClose={detailObj.hideDetail}
                onSaveSuccess={onSaveSuccess}
              />
            )}
          </Card>
        </View>
      );
    }

    const keys = Object.keys(Inputs[type]);
    let incomplete = false;
    let empty = true;
    let outputs = [];

    if (type === 'profile') {
      empty = false;
      outputs = keys.map(key => {
        if (
          key !== 'primary' &&
          !(key === 'id_number' && profileConfig.hideID)
        ) {
          const label = safe(Inputs[type][key], 'label', '');
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
          const label = safe(Inputs[type][key], 'label', '');
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
    }

    return (
      <Card
        onPressContent={() => detailObj.showDetail(index)}
        onPressContentDisabled={!this.editable()}
        canEdit={this.editable()}
        design={design.settings}
        removeDefaultContainerStyle={true}>
        <CardLayout
          actionOne={this.actionOne(item, index)}
          actionTwo={this.actionTwo(item, index)}
          actionFooter={this.actionFooter(item, index)}
          design={design.settings}>
          <View bC={'surfaceCard'} pt={0.1}>
            {outputs.map((field, index) => {
              if (!field) {
                return null;
              }
              if (field.label === 'Currencies') {
                //TODO: map of currencies
                if (field.value.length && field.value.length > 0) {
                  return (
                    <Output
                      key={index.toString()}
                      label={field.label}
                      value={field.value.map(
                        (item, ind) => (ind > 0 ? ', ' : '') + item.code,
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
            {incomplete ? (
              <Text o={0.7} style={{ paddingTop: 9 }}>
                {empty ? 'Not yet provided' : 'Incomplete'}
              </Text>
            ) : null}
          </View>
        </CardLayout>
      </Card>
    );
  }
}

const RehiveFormCard = context(_RehiveFormCard);

export { RehiveFormCard };
