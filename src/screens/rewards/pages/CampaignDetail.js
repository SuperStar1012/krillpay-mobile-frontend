import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { View, Text, Button } from 'components';
import { displayFormatDivisibility } from 'utility/general';
import { claimReward } from 'utility/rehive';
import RewardPlaceholderImage from '../components/images';
import Markdown from 'components/outputs/Markdown';
import { useToast } from 'contexts/ToastContext';
import HeaderNew from 'components/layout/HeaderNew';

export default function CampaignDetail(props) {
  const [loading, setLoading] = useState(false);
  const { route, navigation, pendingRewards, onRefresh } = props;
  const { item } = route?.params ?? {};

  const { showToast } = useToast();

  async function handleClaimReward(campaign) {
    setLoading(true);
    let response;
    try {
      response = await claimReward({
        campaign: campaign.id,
      });
      let variant = '';
      let text = '';
      if (response.status === 'success') {
        variant = 'success';
        text =
          campaign.default_status === 'accepted'
            ? 'Reward successfully claimed'
            : 'Your reward has been requested and it will reflect in your wallet balance upon admin approval';
        navigation.goBack();
        if (onRefresh) {
          onRefresh();
        }
      } else {
        if (
          response.message.includes('transaction') &&
          response.message.includes('amount')
        ) {
          if (response.message.includes(' 0.0')) {
            text = `You're unable to request this reward, required tier not met.`;
          } else {
            text = `You've reached your request limit for rewards, required tier not met.`;
          }
        } else {
          variant = 'error';
          text =
            'Unable to request reward' +
            (response.message ? ': ' + response.message : '');
        }
      }
      showToast({
        variant,
        text,
        duration: 3000,
      });
    } catch (e) {
      showToast({
        variant: 'error',
        text: 'Unable to request reward' + (e.message ? ': ' + e.message : ''),
        duration: 3000,
      });
      console.log(e);
    }
    setLoading(false);
  }

  if (!item) {
    return null;
  }
  const {
    end_date,
    currency,
    fixed_amount,
    description,
    name,
    default_status,
    claim,
    type,
    percentage,
    active,
    image,
  } = item;

  const pending = pendingRewards && pendingRewards.includes(item.id);

  const hideAction = end_date < Date.now() || !claim;

  const actionOne = {
    id: default_status === 'accepted' ? 'claim' : 'request',
    onPress: () => {
      handleClaimReward(item);
    },
    loading,
    wide: true,
    disabled: pending || !active,
  };

  const amountString =
    currency.symbol +
    displayFormatDivisibility(fixed_amount, currency.divisibility);
  const percentageString = parseFloat(percentage).toString() + '%';

  const isPercentage = type === 'percentage';

  return (
    <View screen>
      <HeaderNew title="" navigation={navigation} />
      <View p={0.5} ph={1.5}>
        <View p={image ? 0 : 1} bC="#F8F8F8" bR={15} aI="center">
          <RewardPlaceholderImage
            rewardName={name}
            size={160}
            src={image}
            detailsPage
          />
        </View>

        <View pv={1}>
          <Text s={17} fW="500" id={name} />
          <View pt={1} pb={0.5}>
            <Text
              t="h3"
              c="primary"
              fW="500"
              id="earn"
              context={{
                amount: isPercentage ? percentageString : amountString,
              }}
            />
          </View>
          <Markdown>{description}</Markdown>
        </View>
        {!hideAction && <Button {...actionOne} />}
      </View>
    </View>
  );
}
