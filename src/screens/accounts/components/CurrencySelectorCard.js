import React, { useState } from 'react';
import { displayFormatDivisibility } from 'utility/general';
import { View } from 'components';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { DynamicCard } from 'components/cards';
import { TouchableOpacity } from 'react-native';
import { getCurrencyCode } from '../util/rates';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { useIsRTL } from 'hooks/general';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@redux/rehive/reducer';
import { getUserCountryFromMSISDN } from 'utility/general';

const CurrencySelectorCard = props => {
  let {
    currency,
    currencies,
    rates,
    updateCurrencyByCode,
    returnCurrency,
    updateCurrency,
    disabled,
    filtered,
    filteredItems,
    title,
    children,
    cardType = 'currency',
  } = props;

  const isRTL = useIsRTL();
  console.log('isRTL', isRTL);
  const [modalVisible, setModalVisible] = useState(false);
  const profile = useSelector(userProfileSelector);
  const user = profile?.data?.[0];

  const items =
    filteredItems ||
    filtered?.data?.map(item => {
      return {
        label:
          getCurrencyCode(item.currency) +
          (currencies.multipleAccounts
            ? ' (' + item.account_name + '): '
            : ': ') +
          displayFormatDivisibility(
            item.available_balance,
            item.currency.divisibility,
          ) +
          ' ' +
          getCurrencyCode(item.currency),
        value: item,
        key: item.account + ':' + item.currency.code,
      };
    });

  const optionsUSD = items.map(item => {
    if (item.value.currency.code == 'USD') {
      return item;
    }
  });

  const filteredOptionsUSD = optionsUSD.filter(function (el) {
    return el != null;
  });

  const hideModal = () => setModalVisible(false);

  const handleCurrencySelection = item => {
    if (returnCurrency) {
      updateCurrency(item.value);
    } else if (updateCurrencyByCode) {
      updateCurrency(item.value.currency.code);
    } else {
      const fullIndex = filtered?.data?.findIndex(
        curr =>
          curr.account === item.value.account &&
          curr.currency.code === item.value.currency.code,
      );
      updateCurrency(fullIndex);
    }
    hideModal();
  };

  return (
    <React.Fragment>
      {children ? (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {children}
        </TouchableOpacity>
      ) : (
        <DynamicCard
          // overlay
          type={cardType}
          item={currency}
          currencies={currencies}
          onPressContentDisabled={disabled}
          rates={rates}
          onPressContent={() => setModalVisible(true)}
        />
      )}

      {/* <ModalFullscreen
        visible={modalVisible}
        scrollView
        title={title ? title : 'Select currency'}
        onDismiss={hideModal}
        docked>
        {items.map((item, index) => (
          <View pb={1} key={item.key}>
            <DynamicCard
              type={cardType}
              item={item.value}
              currencies={currencies}
              rates={rates}
              onPressContent={() => handleCurrencySelection(item)}
            />
          </View>
        ))}
      </ModalFullscreen> */}
      <PopUpGeneral
        title={title ? title : 'select_currency'}
        titleColor="#000000"
        docked
        visible={modalVisible}
        onDismiss={hideModal}
        iconTitleLeft={isRTL ? 'chevron-right' : 'chevron-left'}
        titleIconContent={props.titleIconContent}
        titleTextAlign={props.titleTextAlign}>
        {getUserCountryFromMSISDN(user?.mobile) == 'US' ? (
          <View pb={1} key={filteredOptionsUSD.key}>
            <DynamicCard
              type={cardType}
              item={filteredOptionsUSD.value}
              currencies={currencies}
              rates={rates}
              onPressContent={() => handleCurrencySelection(filteredOptionsUSD)}
            />
          </View>
        ) : (
          items.map((item, index) => (
            <View pb={1} key={item.key}>
              <DynamicCard
                type={cardType}
                item={item.value}
                currencies={currencies}
                rates={rates}
                onPressContent={() => handleCurrencySelection(item)}
              />
            </View>
          ))
        )}

        {/*items.map((item, index) => (
          <View pb={1} key={item.key}>
            <DynamicCard
              type={cardType}
              item={item.value}
              currencies={currencies}
              rates={rates}
              onPressContent={() => handleCurrencySelection(item)}
            />
          </View>
        ))*/}
      </PopUpGeneral>
    </React.Fragment>
  );
};

export default CurrencySelectorCard;
