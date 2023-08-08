import React from 'react';

import { Pressable } from 'react-native';
import { Text, View } from 'components';
import { Icon } from 'components/outputs/Icon';
import { useKeyboard } from 'hooks/keyboard';

export default function NumpadOnly({
  currency,
  inputValue,
  setValue,
  ...restProps
}) {
  function handleAmountUpdate(value) {
    setValue(value);
  }
  const { keyboardHeight } = useKeyboard();

  const value = inputValue.toString();
  function handleButton(key) {
    if (key === 'backspace') {
      let temp = value.length > 0 ? value?.slice(0, -1) : '';
      handleAmountUpdate(temp);
    } else if (key === 'reset') {
      handleAmountUpdate('');
    } else if (key === '.') {
      if (!value.includes('.')) handleAmountUpdate((value ? value : '0') + '.');
    } else {
      const split = value.toString()?.split('.');
      if ((split?.[1]?.length ?? 0) < currency?.currency?.divisibility)
        handleAmountUpdate(value + key);
    }
  }
  if (keyboardHeight) return null;

  return (
    <View w="100%" aI="center" f={1} jC="space-around">
      <View fD="row" w="100%" h={70}>
        <Button align="flex-start" onPress={handleButton}>
          1
        </Button>
        <Button align="center" onPress={handleButton}>
          2
        </Button>
        <Button align="flex-end" onPress={handleButton}>
          3
        </Button>
      </View>
      <View fD="row" w="100%" h={70}>
        <Button align="flex-start" onPress={handleButton}>
          4
        </Button>
        <Button align="center" onPress={handleButton}>
          5
        </Button>
        <Button align="flex-end" onPress={handleButton}>
          6
        </Button>
      </View>
      <View fD="row" h={70}>
        <Button align="flex-start" onPress={handleButton}>
          7
        </Button>
        <Button align="center" onPress={handleButton}>
          8
        </Button>
        <Button align="flex-end" onPress={handleButton}>
          9
        </Button>
      </View>
      <View fD="row" h={70}>
        <Button align="flex-start" onPress={handleButton}>
          .
        </Button>
        <Button align="center" onPress={handleButton}>
          0
        </Button>
        <Button align="flex-end" onPress={handleButton}>
          backspace
        </Button>
      </View>
    </View>
  );
}

function Button(props) {
  const { children, onPress, align } = props;
  return (
    <Pressable
      onPress={() => onPress(children)}
      onLongPress={() => onPress(children === 'backspace' ? 'reset' : children)} //TODO: add multiadd number
      style={{
        flex: 1,
        alignItems: align,
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
