import React from 'react';
import * as WebBrowser from 'expo-web-browser';

import { View } from 'components/layout/View';
import { Text } from 'components';
import OutputList from 'components/outputs/OutputList';
import client from 'config/client';
import Image from 'components/outputs/Image';
import { getName } from 'country-list';

export default function AboutContent(props) {
  const { company, hideDescription } = props;
  const {
    id,
    name,
    description,
    country,
    support_website,
    settings = {},
    support_email,
    website,
  } = company;

  const { privacy_policy_url, terms_and_conditions_url } = settings;

  const image = company.icon ? company.icon : company.logo;

  let outputs = [];

  outputs.push({
    label: 'website',
    value: website,
    link: website,
    placeholder: 'Not yet provided',
  });
  outputs.push({
    label: 'country',
    value: country && getName(country),
    placeholder: 'Not yet provided',
  });
  outputs.push({
    label: 'support_email',
    value: support_email,
    link: 'mailto:' + support_email,
    placeholder: 'Not yet provided',
  });
  outputs.push({
    label: 'support_website',
    value: support_website,
    link: support_website,
    placeholder: 'Not yet provided',
  });

  const textButtonStyle = { o: 0.8, c: 'primary', t: 'sq' };

  return (
    <View ph={1} jC={'space-between'} f={1}>
      <View p={0.5}>
        <View fD={'column'} w="100%" aI="center" pb={0.5}>
          {/* <View bR={100} h={40} w={40}> */}
          {image ? (
            <View
              mb={1}
              // style={{ marginRight: 16 }}
              h={40}
              w={40}
              bR={500}
              aI={'center'}
              jC={'center'}>
              <Image
                resizeMode={'contain'}
                src={image}
                width={40}
                height={40}
              />
            </View>
          ) : null}
          {/* </View> */}
          <Text s={20} fW="bold" tA="center" width="100%" c="#222222">
            {name ?? id}
          </Text>
          {Boolean(description) && (
            <View w="100%" pt={0.75} pb={0.5}>
              <Text s={14} tA="center" width="100%" lH={22} c="#848484">
                {description}
              </Text>
            </View>
          )}
        </View>

        <OutputList
          items={outputs}
          outputProps={{ labelBold: true, labelColor: '#222222' }}
        />
      </View>
      <View fD={'row'} jC={'space-between'} aI={'center'} pb={2} ph={1}>
        <Text
          {...textButtonStyle}
          id="privacy_policy"
          onPress={() =>
            WebBrowser.openBrowserAsync(
              privacy_policy_url
                ? privacy_policy_url
                : client.privacy_policy_url,
            )
          }
        />

        <Text
          {...textButtonStyle}
          id="terms_of_use"
          onPress={() =>
            WebBrowser.openBrowserAsync(
              terms_and_conditions_url
                ? terms_and_conditions_url
                : client.terms_and_conditions_url,
            )
          }
        />
      </View>
    </View>
  );
}
