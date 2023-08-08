import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import client from 'config/client';
import { View, Text } from 'components';
import Title from 'components/layout/Title';
import OutputList from 'components/outputs/OutputList';
import Image from 'components/outputs/Image';

export default function AboutContent(props) {
  const { company } = props;
  const {
    id,
    name,
    description,
    country,
    support_website,
    settings = {},
    support_email,
    website,
    icon,
  } = company;

  const { privacy_policy_url, terms_and_conditions_url } = settings;

  let outputs = [];

  // if (website) {
  outputs.push({
    label: 'website',
    value: website,
    link: website,
    placeholder: 'not_yet_provided',
  });
  // }
  // if (country) {
  outputs.push({
    label: 'country',
    value: country,
    placeholder: 'not_yet_provided',
  });
  // }

  // if (support_email) {
  outputs.push({
    label: 'support_email',
    value: support_email,
    link: 'mailto:' + support_email,
    placeholder: 'not_yet_provided',
  });
  // }

  // if (support_link) {
  outputs.push({
    label: 'support_website',
    value: support_website,
    link: support_website,
    placeholder: 'not_yet_provided',
  });
  // }

  let buttons = [
    {
      id: 'privacy_policy',
      link: privacy_policy_url ? privacy_policy_url : client.privacy_policy_url,
      type: 'text',
      color: 'primary',
    },
    {
      id: 'terms_of_use',
      link: terms_and_conditions_url
        ? terms_and_conditions_url
        : client.terms_and_conditions_url,
      type: 'text',
      color: 'primary',
    },
  ];

  return (
    <View ph={0.5} jC={'space-between'} f={1}>
      <View pb={0.5}>
        <View fD={'column'} w="100%" aI="center" pb={0.5}>
          {/* <View bR={100} h={40} w={40}> */}
          {icon ? (
            <View
              mb={1}
              // style={{ marginRight: 16 }}
              h={40}
              w={40}
              bR={500}
              aI={'center'}
              jC={'center'}>
              <Image resizeMode={'contain'} src={icon} width={40} height={40} />
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
      <View fD={'row'} jC={'space-between'} aI={'center'} pb={2}>
        <Text
          s={16}
          style={{ textDecorationLine: 'underline' }}
          c="primary"
          o={0.8}
          onPress={() => WebBrowser.openBrowserAsync(buttons[0].link)}
          id={buttons[0].id}></Text>
        <Text
          s={16}
          style={{ textDecorationLine: 'underline' }}
          c="primary"
          o={0.8}
          onPress={() => WebBrowser.openBrowserAsync(buttons[1].link)}
          id={buttons[1].id}></Text>
      </View>
    </View>
  );
}
