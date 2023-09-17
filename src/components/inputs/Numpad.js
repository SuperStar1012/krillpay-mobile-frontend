import React, { useEffect, useRef } from 'react';

import { Pressable } from 'react-native';
import { Text, View } from 'components';
import * as Animatable from 'react-native-animatable';
import { Icon } from 'components/outputs/Icon';
import {
  getCurrencyCode,
  useConversion,
  formatConvAmount,
  calculateRate,
  formatDecimals,
} from 'utility/rates';
import Big from 'big.js';

export default function Numpad(props) {
  const {
    placeholder = '0',
    form,
    name = 'amount',
    context,
    max,
    error,
    config = {},
  } = props;
  const { validation = true, hideAmount = false } = config;
  const { wallet, services, rates } = context;
  const { setValue, watch, register } = form;
  const amount = watch('amount');
  const amountDisplay = watch('amountDisplay');
  const display = watch('display');
  const { currency = {} } = wallet;
  const amountRef = useRef();

  useEffect(() => {
    register(name);
  }, [register]);

  const convRate = calculateRate(
    rates?.displayCurrency?.code,
    currency?.code,
    rates?.rates,
  );

  useEffect(() => {
    let timer = null;
    if (amount && !amountDisplay) {
      const valueFloat = parseFloat(amount) ?? 0;
      const convValue = formatDecimals(
        Big(valueFloat).div(convRate ? convRate : 1),
        rates?.displayCurrency?.divisibility,
      );
      timer = setTimeout(() => setValue('amountDisplay', convValue), 10);
    }
    return () => clearTimeout(timer);
  }, [amount]);

  function handleShake() {
    amountRef.current?.shake(600);
  }

  function handleAmountUpdate(value) {
    if (value) {
      const valueFloat = parseFloat(value);
      setValue(
        name + 'Display',
        display
          ? value
          : formatDecimals(
              Big(valueFloat).div(convRate ? convRate : 1),
              rates?.displayCurrency?.divisibility,
            ),
      );
      setValue(
        name,
        display
          ? Big(valueFloat)
              .times(convRate ? convRate : 1)
              .toString()
          : value,
      );
    } else {
      setValue(name + 'Display', '');
      setValue(name, '');
    }
  }

  const value = (display ? amountDisplay : amount ? amount : '').toString();
  function handleButton(key) {
    if (key === 'backspace') {
      let temp = value.length > 0 ? value?.slice(0, -1) : '';
      handleAmountUpdate(temp);
    } else if (key === 'reset') {
      handleAmountUpdate('');
    } else if (key === '.') {
      if (!value.includes('.')) handleAmountUpdate((value ? value : '0') + '.');
      else handleShake();
    } else {
      const split = value.toString()?.split('.');
      if ((split?.[1]?.length ?? 0) < currency?.divisibility)
        handleAmountUpdate(value + key);
      else handleShake();
    }
  }

  const { hasConversion } = useConversion(
    parseFloat(value),
    services,
    currency,
  );

  function handleMax() {
    setValue(name, max);
    setValue(
      name + 'Display',
      formatDecimals(
        Big(!isNaN(max) && max ? max : 0).div(
          typeof convRate === 'number' && convRate > 0 ? convRate : 1,
        ),
        rates?.displayCurrency?.divisibility,
      ),
    );
  }

  function handleDisplay() {
    setValue('display', !display);
  }

  return (
    <View aI="center" f={1}>
      {!hideAmount && (
        <View aI="center" jC="center" w="100%" style={{ minHeight: 100 }}>
          <Text s={20} c="fontLight" fW="bold">
            {getCurrencyCode(
              display && hasConversion ? rates.displayCurrency : currency,
            )}
          </Text>
          <View fD="row" aI="center" ph={2.5} style={{ minHeight: 80 }}>
            {validation ? (
              <Pressable onPress={handleMax}>
                <View
                  bC="primary"
                  bR={100}
                  h={30}
                  w={30}
                  mr={1.5}
                  aI="center"
                  jC="center">
                  <Text s={10} fW="bold" c="white" lH={12}>
                    MAX
                  </Text>
                </View>
              </Pressable>
            ) : (
              <View bR={100} h={30} w={30} mr={1.5}></View>
            )}
            <Animatable.View
              ref={amountRef}
              style={{ minWidth: 40, maxWidth: '60%' }}>
              <Text
                s={65}
                adjustsFontSizeToFit
                numberOfLines={1}
                fW="bold"
                c={value ? 'fontDark' : 'fontLight'}
                // style={{ minWidth: 40, maxWidth: '60%' }}
                tA="center">
                {value ? value : placeholder}
              </Text>
            </Animatable.View>
            {hasConversion ? (
              <Pressable onPress={handleDisplay}>
                <View
                  bC="primary"
                  bR={100}
                  h={30}
                  w={30}
                  ml={1.5}
                  aI="center"
                  jC="center">
                  <Icon
                    color="white"
                    name={'swap-vert'}
                    set="MaterialIcons"
                    size={24}
                  />
                </View>
              </Pressable>
            ) : (
              <View bR={100} h={30} w={30} ml={1.5}></View>
            )}
          </View>
          {hasConversion && (
            <Text s={12} c="fontLight">
              {formatConvAmount({
                currency: { currency },
                values: { amount: value, display },
                rates,
              })}
            </Text>
          )}
          <View style={{ minHeight: 34 }} pt={0.5}>
            <Text c="error">{error}</Text>
          </View>
        </View>
      )}

      <View f={2} w="100%">
        <View f={1} fD="row" w="100%">
          <Button onPress={handleButton}>1</Button>
          <Button onPress={handleButton}>2</Button>
          <Button onPress={handleButton}>3</Button>
        </View>
        <View f={1} fD="row" w="100%">
          <Button onPress={handleButton}>4</Button>
          <Button onPress={handleButton}>5</Button>
          <Button onPress={handleButton}>6</Button>
        </View>
        <View f={1} fD="row">
          <Button onPress={handleButton}>7</Button>
          <Button onPress={handleButton}>8</Button>
          <Button onPress={handleButton}>9</Button>
        </View>
        <View f={1} fD="row">
          <Button onPress={handleButton}>.</Button>
          <Button onPress={handleButton}>0</Button>
          <Button onPress={handleButton}>backspace</Button>
        </View>
      </View>
    </View>
  );
}

function Button(props) {
  const { children, onPress } = props;
  return (
    <Pressable
      onPress={() => onPress(children)}
      onLongPress={() => onPress(children === 'backspace' ? 'reset' : children)} //TODO: add multiadd number
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // width: '33.3%',
      }}>
      {children === 'backspace' ? (
        <Icon
          size={25}
          color="fontLight"
          name="backspace-outline"
          set="MaterialCommunityIcons"
        />
      ) : (
        <Text fW="500" s={20}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
