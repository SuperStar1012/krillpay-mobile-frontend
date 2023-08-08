import React from 'react';

import { View, Text, Button } from 'components';
import { standardizeString } from 'utility/general';

export default function Stepper(props) {
  const { step, steps, setStep } = props;
  const stepIndex = steps.findIndex(item => item === step);

  return (
    <View fD="row" aI="center" ph={1} pv={0.5} jC="space-around">
      {steps.map((item, index) => (
        <StepperItem
          key={item}
          item={item}
          index={index}
          setStep={setStep}
          currentIndex={stepIndex}
        />
      ))}
    </View>
  );
}

function StepperItem(props) {
  const { item, index, currentIndex, setStep } = props;

  return (
    <Button onPress={() => setStep(item)}>
      <View fD="row" aI="center">
        <View
          c={index > currentIndex ? 'font' : 'primary'}
          bR={100}
          h={20}
          bC={index < currentIndex ? 'primary' : 'transparent'}
          w={20}
          aI="center"
          jC="center"
          pl={0.1}
          mr={0.25}>
          <Text
            s={14}
            lH={16.5}
            c={
              index < currentIndex
                ? 'white'
                : index > currentIndex
                ? 'font'
                : 'primary'
            }>
            {index + 1}
          </Text>
        </View>
        <Text c={index > currentIndex ? 'font' : 'primary'} id={item} />
      </View>
    </Button>
  );
}
