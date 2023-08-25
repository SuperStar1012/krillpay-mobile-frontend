import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Text, View, Button } from 'components';
import ProfilePlaceholder from './ProfilePlaceholder';
import { useTheme } from 'components/context';
import { getActiveTier } from 'utility/general';

export default function HeaderProfile(props) {
  const { context = {}, navigation } = props;

  const [showModal, setShowModal] = useState(false);

  const { colors, design } = useTheme();
  if (!context?.user) {
    return (
      <View p={1} ph={1.25} style={styles.viewStyleContainer}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            // style={viewStyleContainer}
          >
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={16}>
              <SkeletonPlaceholder.Item
                width={120}
                height={18}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                marginTop={8}
                width={80}
                height={15}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  }
  const { tiers = {}, user } = context ?? {};

  const photoLink = user?.profile;
  const name = user?.first_name ? user?.first_name + ' ' + user?.last_name : '';

  const { viewStyleContainer, imageStylePhoto, viewStyleName } = styles;

  const item = getActiveTier(tiers);

  const tierDescription = item
    ? 'Tier ' + item.level + (item.name ? ' - ' + item.name : '')
    : '';

  return (
    <View
      bC={design.app.surface ? 'transparent' : 'header'}
      p={1}
      ph={1}
      fD="row"
      aI="center"
      style={viewStyleContainer}>
      <>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
        </SkeletonPlaceholder>
        <View pos="absolute" pl={1}>
          {photoLink ? (
            <Image
              style={[
                imageStylePhoto,
                {
                  borderColor: colors.headerContrast,
                },
              ]}
              source={{
                uri: photoLink,
                // cache: 'only-if-cached',
              }}
              key={photoLink}
            />
          ) : (
            <ProfilePlaceholder size={50} />
          )}
        </View>
      </>
      <View fD="column" pl={1} aI="flex-start">
        {name ? (
          <View pb={tierDescription ? 0.25 : 0} style={viewStyleName}>
            <Text color="fontDark">{name}</Text>
          </View>
        ) : null}
        {tierDescription ? (
          <Button onPress={() => navigation.navigate('Tier')}>
            <Text s={15} c={'primary'} fW="500">
              {tierDescription}
            </Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyleContainer: {
    borderBottomWidth: 1,
    marginBottom: 1,
    borderBottomColor: '#E0E0E0',
    // elevation: 2,
    // zIndex: 2,
  },
  imageStylePhoto: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderWidth: 0,
  },
  viewStyleName: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
});
