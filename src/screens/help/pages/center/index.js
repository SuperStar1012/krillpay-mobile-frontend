import React, { useState } from 'react';
import { View } from 'components';
import Header from 'components/layout/HeaderNew';
import SearchBox from 'screens/help/components/SearchBox';
import TabBar from 'screens/help/components/TabBar';
import LinkList from 'screens/help/components/LinkList';
import QuestionsList from 'screens/help/components/QuestionsList';
import pages from './pages';
import { useRehiveContext } from 'contexts';
import { useRehive } from 'hooks/rehive';

const config = {
  order: ['depositing_money', 'withdrawing_money'],
  tabs: pages,
};

export default function HelpCenterPage(props) {
  const { navigation, route } = props;


  const rehiveContext = useRehiveContext();

  const [tabId, setTabId] = useState(
    route?.params?.tab ?? config?.order?.[0] ?? '',
  );
  const tabConfig = config?.tabs?.[tabId] ?? {};

  const [sectionId, setSectionId] = useState('');

  const {
    context: { companyBankAccounts },
  } = useRehive(['companyBankAccounts']);
  const context = { ...rehiveContext, companyBankAccounts };

  // function handleChange(tabId, sectionId){
  //   setTabId(tabId)
  //   setSectionId(sectionId)
  // }

  return (
    <View screen bC={'white'}>
      {sectionId ? (
        <QuestionsList
          context={context}
          setTabId={setTabId}
          setSectionId={setSectionId}
          id={sectionId}
          config={tabConfig}
        />
      ) : (
        <>
          <Header navigation={navigation} title="having_trouble_" bold />
          <View scrollView pt={1}>
            {/* <SearchBox /> */}
            <TabBar
              items={config?.order}
              selected={tabId}
              onSelect={setTabId}
            />
            <LinkList
              context={context}
              id={tabId}
              config={tabConfig}
              onSelect={setSectionId}
            />
          </View>
        </>
      )}
    </View>
  );
}
