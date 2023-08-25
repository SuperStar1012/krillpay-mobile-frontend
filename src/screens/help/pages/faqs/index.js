import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import Accordion from 'react-native-collapsible/Accordion';
import { View, Text, EmptyListMessage } from 'components';
import Header from 'components/layout/HeaderNew';
import { Icon } from 'components/outputs/Icon';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function FAQsPage(props) {
  const { navigation } = props;

  const [activeSections, setActiveSections] = useState([]);

  const {
    context: { company },
    config: { faqConfig },
  } = useRehiveContext();

  const sections =
    faqConfig?.questions?.map((x, index) => {
      return {
        ...x['en'],
        index,
      };
    }) ?? [];

  const isEmpty = !sections?.length;

  return (
    <View screen bC={'white'}>
      <Header navigation={navigation} />
      <View scrollView>
        <View ph={1} pv={1.5}>
          <Text
            tA={'center'}
            fW={'bold'}
            s={20}
            id="frequently_asked_questions"></Text>

          {Boolean(faqConfig?.description) && (
            <View mv={1}>
              <Text tA={'center'} s={14} c={'grey4'}>
                {faqConfig?.description}
              </Text>
            </View>
          )}

          {isEmpty ? (
            <EmptyListMessage id="faqs" />
          ) : (
            <View mb={1.5} w={'100%'}>
              <Accordion
                activeSections={activeSections}
                sections={sections}
                underlayColor={'transparent'}
                duration={0}
                renderHeader={section => (
                  <View
                    mv={0.5}
                    f={1}
                    fD={'row'}
                    jC={'space-between'}
                    aI={'center'}
                    w={'100%'}>
                    <View f={1} pr={0.5}>
                      <Text fW={'bold'} s={15}>
                        {section.question}
                      </Text>
                    </View>
                    <Icon
                      name={
                        activeSections.includes(section.index)
                          ? 'remove'
                          : 'add'
                      }
                      size={24}
                      set="MaterialIcons"
                      color={'grey4'}
                    />
                  </View>
                )}
                renderContent={section => (
                  <View mv={0.5}>
                    <Text c={'grey4'} s={14}>
                      {section.answer}
                    </Text>
                  </View>
                )}
                onChange={activeSections => setActiveSections(activeSections)}
              />
            </View>
          )}
          {company.contact_email && (
            <View w={'100%'}>
              <Text tA={'center'} fW={'bold'} s={20} id="still_stuck" />
              <View mt={0.5}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('mailto:' + company.contact_email)
                  }>
                  <Text tA={'center'} s={16} c={'primary'} fW={'500'}>
                    {company.contact_email}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
