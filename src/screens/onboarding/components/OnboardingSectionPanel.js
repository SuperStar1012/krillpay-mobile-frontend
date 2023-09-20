import React from 'react';
import { TouchableOpacity, ScrollView, Dimensions, Text } from 'react-native';
import { View } from 'components/layout/View';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function OnboardingSectionPanel(props) {
  const {
    sections,
    activeSection,
    setCurrentStep,
    canSkip,
    currentSection,
    completedSections,
  } = props;
  const { fields } = activeSection;
  const { length } = sections;

  function renderSection(section, index) {
    return (
      <View h={30} jC={'center'}>
        <View
          w={48}
          h={6}
          bC={
            index === currentSection || section.completed
              ? 'primary'
              : section.hasError
              ? '#CC2538'
              : index < currentSection && !section.completed
              ? '#777777'
              : '#EFEFEF'
          }
          bR={100}></View>
      </View>
    );
  }

  if (!fields?.length)
    return (
      <View mh={1.5} h={6}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection={'row'}
            alignItems="center"
            h={6}>
            <SkeletonPlaceholder.Item
              width={48}
              height={6}
              borderRadius={100}
            />
            <SkeletonPlaceholder.Item
              width={48}
              height={6}
              borderRadius={100}
              marginHorizontal={20}
            />
            <SkeletonPlaceholder.Item
              width={48}
              height={6}
              borderRadius={100}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        showsHorizontalScrollIndicator={false}>
        {sections.map((section, index) => (
          <View
            w={SCREEN_WIDTH / (length > 5 ? 6.5 : 6)}
            aI="center"
            mr={index === sections.length - 1 ? 1 : 0.25}
            ml={index === 0 ? 1 : 0.25}
            key={section.id}>
            <TouchableOpacity
              disabled={
                !canSkip && index > currentSection && completedSections < index
              }
              onPress={() => setCurrentStep(index)}>
              {renderSection(section, index)}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
