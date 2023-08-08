import React, { useState } from 'react';
import { View, PopUpGeneral } from 'components';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { TouchableOpacity } from 'react-native';
import { DynamicCard } from 'components/cards';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
} from '@redux/rehive/reducer';
import { getUserCountryFromMSISDN } from 'utility/general';


const CurrencySelectorCard = props => {
  let {
    currency,
    currencies,
    rates,
    updateCurrency,
    disabled,
    title,
    children,
    items,
    variant = '',
    cardType = 'currency',
  } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const hideModal = () => setModalVisible(false);
  const profile = useSelector(userProfileSelector);
  const user = profile?.data?.[0];


  const optionsUSD = items.map(item => {
    if(item.value.currency.code =="USD")
    {
      return item;
    }
  });


  const filteredOptionsUSD = optionsUSD.filter(function (el) {
    return el != null;
  });


  function handleSelect(item) {
    updateCurrency(item?.value);
    hideModal();
  }

  const ListComponent = items.map((item, index) => (
    <View pb={1} key={item.key}>
      <DynamicCard
        type={cardType}
        simple
        item={item.value || item}
        disabled={disabled}
        currencies={currencies}
        rates={rates}
        onPressContent={() => handleSelect(item)}
      />
    </View>
  ));

  if (variant === 'list') return ListComponent;

  return (
    <React.Fragment>
      {children ? (
        <TouchableOpacity
          disabled={disabled}
          onPress={() => setModalVisible(true)}>
          {children}
        </TouchableOpacity>
      ) : (
        <DynamicCard
          // overlay
          type={cardType}
          simple
          item={currency}
          currencies={currencies}
          disabled={disabled}
          rates={rates}
          onPressContent={() => setModalVisible(true)}
        />
      )}

      <ModalFullscreen
        visible={modalVisible}
        scrollView
        title={title ? title : 'Select currency'}
        onDismiss={hideModal}
        docked>

 
    {  getUserCountryFromMSISDN(user?.mobile) == "US" ? 

         <DynamicCard
         type={cardType}
         simple
         item={filteredOptionsUSD[0].value || filteredOptionsUSD[0]}
         currencies={currencies}
         rates={rates}
         onPressContent={() => {
           // const fullIndex = filtered.data.findIndex(
           //   curr =>
           //     curr.account === item.value || item.account &&
           //     curr.currency.code === item.value || item.currency.code,
           // );
           //updateCurrency(item?.value);
           hideModal();
         }}
       />
          : 
        items.map((item, index) => (
              <View pb={1} key={item.key}>
                <DynamicCard
                  type={cardType}
                  simple
                  item={item.value || item}
                  currencies={currencies}
                  rates={rates}
                  onPressContent={() => {
                    // const fullIndex = filtered.data.findIndex(
                    //   curr =>
                    //     curr.account === item.value || item.account &&
                    //     curr.currency.code === item.value || item.currency.code,
                    // );
                    updateCurrency(item?.value);
                    hideModal();
                  }}
                />
              </View>
            ))
      }   
        {/*items.map((item, index) => (
          <View pb={1} key={item.key}>
            <DynamicCard
              type={cardType}
              simple
              item={item.value || item}
              currencies={currencies}
              rates={rates}
              onPressContent={() => {
                // const fullIndex = filtered.data.findIndex(
                //   curr =>
                //     curr.account === item.value || item.account &&
                //     curr.currency.code === item.value || item.currency.code,
                // );
                updateCurrency(item?.value);
                hideModal();
              }}
            />
          </View>
            ))*/}
      </ModalFullscreen>
    </React.Fragment>
  );
};

export default CurrencySelectorCard;
