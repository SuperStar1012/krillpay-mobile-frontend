import React from 'react';
import ColorAlpha from 'color-alpha';
import { max } from 'lodash';
import { View, Text } from 'components';
import Alert from 'components/outputs/Alert';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useTheme } from 'components/context';
import { sentenceCase } from 'utility/general';
import PromptCard from './PromptCard';
import AnnouncementCard from './AnnouncementCard';
import PostCard from './PostCard';

export default function NotificationCard(props) {
  const {
    item = {},
    navigation,
    currency,
    handleDismiss,
    onboardingConfig,
    onboardingSections,
    tiers,
    userGroupTiers,
  } = props;

  const { type } = item;

  let {
    id,
    title,
    description,
    image,
    dismissible,
    variant,
    action,
    actionText,
    titleColor,
    onPress,
  } = item.content ?? item;

  const { colors } = useTheme();

  function renderPrompt() {
    let onPress = (item.content ?? item)?.onPress,
      rightSlot,
      colorVariant;

    switch (variant) {
      case 'kyc':
        onPress = () => navigation.navigate('WebView', { id: 'WyreKYC' });
        break;
      case 'redeem':
        onPress = () => navigation.navigate('PoS', { screen: 'RedeemVoucher' });
        break;
      case 'document':
        onPress = () =>
          navigation.navigate('Profile', {
            screen: 'ProfilePage',
            params: {
              id: 'document',
            },
          });
        image = 'document';
        break;
      case 'bank':
      case 'crypto':
        if (
          (variant === 'crypto' && !currency?.crypto) ||
          (variant === 'bank' && currency?.crypto)
        )
          return null;
        image = currency?.crypto ? 'crypto' : 'userBank';
        onPress = () =>
          navigation.navigate('Profile', {
            screen: 'SettingsPage',
            params: {
              id: currency?.crypto ? 'cryptoAccounts' : 'bankAccounts',
            },
          });
        break;

      case 'verify':
        if (!onboardingSections.length) return null;

        const primaryLighter = ColorAlpha(colors.primary, 0.3);

        const completedSections =
          onboardingSections.filter(x => Boolean(x.completed))?.length ?? 0;

        const topTier =
          max(userGroupTiers?.data?.results?.map(x => x.level)) ?? false;
        const currentTier = tiers?.items?.[0]?.level ?? true;

        const state =
          currentTier === topTier
            ? 'complete'
            : onboardingSections.find(x => x.hasError)
            ? 'failed'
            : completedSections === 0
            ? 'get_started'
            : completedSections < onboardingSections.length
            ? 'continue'
            : onboardingSections.find(x => x.pending)
            ? 'pending'
            : 'complete';

        onPress = () => navigation.navigate('Onboarding');

        switch (state) {
          case 'failed':
            // actionText = 'tap_to_view_details';
            image = 'userDocFailed';
            titleColor = 'fail';
            // colorVariant = 'error';
            if (
              !onboardingSections.find(
                x =>
                  x.hasError &&
                  !['address_verification', 'identity'].includes(x.id),
              )
            )
              onPress = () =>
                navigation.navigate('Profile', {
                  screen: 'ProfilePage',
                  params: { id: 'document' },
                });

            break;
          case 'complete':
            actionText = 'tap_to_close';
            image = 'userVerifySuccess';
            colorVariant = 'success';
            onPress = () => handleDismiss({ section: 'prompts', id });
            break;
          case 'pending':
            image = 'userVerifyPending';
            onPress = () =>
              navigation.navigate('Profile', {
                screen: 'ProfilePage',
                params: { id: 'document' },
              });
            break;
          case 'continue':
            rightSlot = (
              <AnimatedCircularProgress
                size={50}
                width={6}
                fill={Math.floor(
                  (completedSections / onboardingSections.length) * 100,
                )}
                rotation={0}
                duration={1500}
                tintColor={colors.primary}
                backgroundColor={primaryLighter}>
                {() => (
                  <Text s={12} fW={'700'} c={'primary'}>
                    {Math.floor(
                      (completedSections / onboardingSections.length) * 100,
                    )}
                    %
                  </Text>
                )}
              </AnimatedCircularProgress>
            );
            break;
          default:
            image = 'userVerify';
            break;
        }

        title =
          onboardingConfig?.locales?.en?.individual_onboarding?.[state]?.title;

        description =
          onboardingConfig?.locales?.en?.individual_onboarding?.[state]
            ?.subtitle;
        break;

      default:
        const routes = action?.split('.');

        onPress = routes?.length
          ? () =>
              navigation.navigate(sentenceCase(routes[0]), {
                pageId: routes?.[1],
                currency,
              })
          : null;
    }

    return (
      <PromptCard
        {...(item?.content ?? item)}
        {...{
          title,
          description,
          onPress,
          rightSlot,
          colorVariant,
          titleColor,
          actionText,
          image,
        }}
      />
    );
  }

  let component;

  switch (type) {
    case 'announcement':
      component = (
        <AnnouncementCard
          {...(item?.content ?? item)}
          handleDismiss={() => handleDismiss({ section: 'announcements', id })}
        />
      );
      break;
    case 'prompt':
      component = renderPrompt();
      break;
    case 'alert':
      component = (
        <Alert
          {...{ variant, message: description }}
          onPress={
            dismissible ? () => handleDismiss({ section: 'alerts', id }) : null
          }
        />
      );
      break;
    case 'post':
      component = (
        <PostCard
          {...(item?.content ?? item)}
          handleDismiss={() => handleDismiss({ section: 'posts', id })}
        />
      );
      break;
    default:
      break;
  }

  return component ? <View mb={1}>{component}</View> : null;
}
