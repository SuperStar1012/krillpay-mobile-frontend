import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
import { Text, View, ListItem, Button } from 'components';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { AddressForm } from 'components/form/AddressForm';
import { RehiveForm } from 'screens/profile/components/RehiveForm';
import { concatAddress } from 'utility/general';
import { useRehive } from 'hooks/rehive';
import { formatAmountString } from 'utility/rates';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRehiveContext } from 'contexts/RehiveContext';

const modalConfig = {
  contact_mobile: {
    title: ' contact mobile number',
    value: item => (item.number ? item.number : item),
    setValue: item => item.number,
  },
  contact_email: {
    title: ' contact email address',
    value: item => (item.email ? item.email : item),
    setValue: item => item.email,
  },
  shipping_address: {
    title: ' shipping address',
    value: item => concatAddress(item),
    setValue: item => concatAddress(item),
  },
  billing_address: {
    title: ' billing address',
    value: item => concatAddress(item),
    setValue: item => concatAddress(item),
  },
};

export default function CheckoutRequired(props) {
  const { cart, currency, onSuccess, onCancel, orderData, setOrderData } =
    props;

  const {
    requires_billing_address,
    requires_contact_email,
    requires_contact_mobile,
    requires_shipping_address,
    total_price,
  } = cart;

  let dataTypes = [];
  let sections = [];
  if (requires_shipping_address || requires_billing_address) {
    dataTypes.push('address');
  }
  if (requires_shipping_address) sections.push('shippingAddress');
  if (requires_billing_address) sections.push('billingAddress');
  if (requires_contact_email) {
    sections.push('email');
    dataTypes.push('email');
  }
  if (requires_contact_mobile) {
    sections.push('mobile');
    dataTypes.push('mobile');
  }
  const {
    context: { user, init },
  } = useRehiveContext();
  const { context, refresh, loading } = useRehive(dataTypes, init, { user });

  const { email, mobile, address } = context;

  const emailItems = email?.items;
  const emailItem =
    emailItems?.find(item => item?.primary) ?? email?.items?.[0];
  const mobileItems = mobile?.items;
  const mobileItem =
    mobileItems?.find(item => item?.primary) ?? mobile?.items?.[0];
  let billingAddresses = [];
  let billingAddress = null;

  billingAddresses =
    address?.items?.filter(item => item?.type === 'billing') ?? [];
  if (billingAddresses.length > 0) {
    billingAddress = billingAddresses[0];
  }

  let shippingAddresses = [];
  let shippingAddress = null;

  shippingAddresses =
    address?.items?.filter(item => item?.type === 'shipping') ?? [];
  if (shippingAddresses.length > 0) {
    shippingAddress = shippingAddresses[0];
  }

  function updateOrderData(id, value) {
    setOrderData({ ...orderData, [id]: value });
  }

  useEffect(() => {
    if (emailItem && !orderData?.contact_email) {
      updateOrderData('contact_email', emailItem?.email);
    }
  }, [emailItem]);
  useEffect(() => {
    if (mobileItem && !orderData?.contact_mobile) {
      updateOrderData('contact_mobile', mobileItem?.number);
    }
  }, [mobileItem]);
  useEffect(() => {
    if (address?.items?.length > 0) {
      if (!orderData?.shipping_address && shippingAddress) {
        updateOrderData(
          'shipping_address',
          concatAddress(shippingAddress, true),
        );
      }
      if (!orderData?.billing_address && billingAddress) {
        updateOrderData('billing_address', concatAddress(billingAddress, true));
      }
    }
  }, [address]);

  const isInvalid =
    (requires_billing_address && !orderData.billing_address) ||
    (requires_contact_email && !orderData.contact_email) ||
    (requires_contact_mobile && !orderData.contact_mobile) ||
    (requires_shipping_address && !orderData.shipping_address);

  const configs = {
    billingAddress: {
      title: 'billingAddress',
      type: 'billing_address',
      value: orderData?.billing_address,
      loading: address?.loading,
    },
    shippingAddress: {
      title: 'shippingAddress',
      type: 'shipping_address',
      value: orderData?.shipping_address,
      loading: address?.loading,
    },
    email: {
      title: 'email',
      type: 'contact_email',
      value: orderData?.contact_email,
      loading: email?.loading,
    },
    mobile: {
      title: 'mobile',
      type: 'contact_mobile',
      value: orderData?.contact_mobile,
      loading: mobile?.loading,
    },
  };

  const priceString = formatAmountString(total_price, currency, true);

  const [modal, setModal] = useState('');

  const [state, setState] = useState('');
  let formType = '';

  let data = [];
  if (modal) {
    switch (modal) {
      case 'contact_email':
        data = emailItems;
        formType = 'email';
        break;
      case 'contact_mobile':
        data = mobileItems;
        formType = 'mobile';
        break;
      case 'shipping_address':
        data = shippingAddresses;
        formType = 'address';
        break;
      case 'billing_address':
        data = billingAddresses;
        formType = 'address';
        break;
      default:
    }
  }
  const {
    config: { profileConfig },
  } = useRehiveContext();

  return (
    <View scrollView>
      {sections.map(item => (
        <RequiredContent
          key={item}
          id={item}
          {...configs[item]}
          setModal={setModal}
        />
      ))}
      <RequiredContent id={'order_summary'}>
        <View>
          <Text id="total" />
          <Text tA="right" f={1} c="primary" fW="500">
            {priceString}
          </Text>
        </View>
      </RequiredContent>
      <View ph={1.5} pt={0.5}>
        <Button
          color={'primary'}
          id={'continue'}
          wide
          disabled={isInvalid}
          onPress={onSuccess}
        />
        <Button wide type={'text'} id={'cancel'} onPress={onCancel} />
      </View>
      <ModalFullscreen
        scrollView
        close
        action={{
          id: state !== 'add' ? 'custom' : '',
          onPress: () => setState('add'),
        }}
        title={
          (state === 'add' ? 'add' : 'select') +
          (modalConfig?.modal?.title ?? '')
        }
        visible={Boolean(modal)}
        onDismiss={() => {
          setModal('');
          setState('');
        }}>
        {state === 'add' ? (
          <View style={{ paddingBottom: 16 }} ph={0.75}>
            {formType === 'address' ? (
              <AddressForm
                onSubmit={values => {
                  updateOrderData(modal, concatAddress(values, true));
                  setState('');
                  setModal('');
                }}
                profileConfig={profileConfig}
                type={modal === 'billing_address' ? 'billing' : 'shipping'}
                onDetailClose={() => setState('')}
              />
            ) : (
              <RehiveForm
                onSubmit={values => {
                  updateOrderData(modal, values?.email ?? values?.number);
                  setState('');
                  setModal('');
                }}
                type={formType}
                onDetailClose={() => setState('')}
              />
            )}
          </View>
        ) : (
          <View ph={0.5}>
            {data.length > 0 ? (
              data.map(item => {
                const valueFunction = modalConfig?.[modal]?.value ?? (() => '');
                const setValueFunction =
                  modalConfig?.[modal]?.setValue ?? (() => '');
                const value = valueFunction(item);

                return (
                  <ListItem
                    noImage
                    key={value}
                    button
                    title={value}
                    onPress={() => {
                      setOrderData({
                        ...orderData,
                        [modal]: setValueFunction(item),
                      });
                      setModal('');
                    }}
                  />
                );
              })
            ) : (
              <View p={0.5}>
                <Text tA="center" id={modal + '_empty'} />
              </View>
            )}
          </View>
        )}
      </ModalFullscreen>
    </View>
  );
}

function RequiredContent(props) {
  let { title, id, value, children, type, setModal, loading } = props;
  return (
    <TouchableOpacity
      disabled={typeof setModal !== 'function'}
      onPress={() =>
        typeof setModal === 'function' ? setModal(type ? type : id) : {}
      }>
      <View bR={5} bC="grey1" mh={1.5} m={0.5} p={1}>
        <View pb={0.5}>
          <Text s={18} c="fontDark" fW="700" id={title ?? id} />
        </View>
        {loading && !value ? (
          <View pv={0.2}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={150}
                height={16}
                borderRadius={50}
              />
            </SkeletonPlaceholder>
          </View>
        ) : children ? (
          children
        ) : (
          <Text c={value ? 'font' : 'fontLight'}>
            {value ? value : 'Not yet provided'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
