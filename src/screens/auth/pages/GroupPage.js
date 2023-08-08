import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { trackFlow } from 'utility/tracking';
import { View, Spinner, Button } from 'components';
import { getPublicCompanyGroups } from 'utility/rehive';
import GroupSelector from '../components/GroupSelector';
import { shiftToStart } from 'utility/general';
import FormLayout from 'components/layout/Form';
import AboutAppFooter from '../components/AboutAppFooter';
import CompanyIconAboutButton from '../components/CompanyIconAboutButton';

export default function GroupPage(props) {
  const {
    onSuccess,
    company,
    onBack,
    authConfig,
    setTempAuth,
    tempAuth,
    loading,
    setLoading,
  } = props;
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(groups[0]);

  function updateGroup(newGroup) {
    trackFlow('register', 'group selection', ['group'], 'clicked', {
      group: newGroup.name.toLowerCase(),
    });
    setGroup(newGroup);
    setTempAuth({ ...tempAuth, group: newGroup, noGroups: false });
  }

  useEffect(() => {
    async function handleGetGroups() {
      const response = await getPublicCompanyGroups(company.id);
      if (response && response.status === 'success') {
       // const results = get(response, ['data', 'results']);
        const results =  [{"name":"individual","label":"Individual","section":"user","description":"Select this to create an account for your personal wallet. Easily store, send, receive funds.","icon":null,"default":true}]; //get(response, ['data', 'results']);

        setGroups(results);

        const defaultGroup = shiftToStart(results, 'default', true)[0];
        updateGroup(defaultGroup);

        if (results && results.length === 1) {
          setTempAuth({ ...tempAuth, noGroups: true });
          onSuccess();
        }
        setLoading(false);
      } else {
        //TODO: handle error? Toast plus back?
      }
    }
    if (authConfig.group) {
      handleGetGroups();
    } else {
      setLoading(false);
      onSuccess();
    }
  }, []);

  const groupSelectorProps = {
    item: group,
    setItem: updateGroup,
    items: groups,
    onSuccess,
  };

  return (
    <FormLayout
      config={{
        id: 'user_group',
        title: 'user_group',
        description: 'user_group_description',
      }}
      footer={
        <View ph={1.5} pv={0.5} w="100%">
          <Button
            wide
            id="continue"
            onPress={() => {
              setTempAuth({ ...tempAuth, group });
              onSuccess();
            }}
          />
          <AboutAppFooter {...props} />
        </View>
      }
      onBack={onBack}
      id="user_group"
      headerProps={{
        rightAction: <CompanyIconAboutButton {...props} />,
      }}>
      {/* <Header
        handleBack={() => onBack()}
        
      /> */}
      {/* <View w="100%"> */}
      {/* <View pb={2}>
            <Text tA={'center'} t="b2" id="group_title" />
          </View> */}
      {loading ? (
        <Spinner containerStyle={{ padding: 16 }} size="large" />
      ) : (
        <React.Fragment>
          <GroupSelector {...groupSelectorProps} />
        </React.Fragment>
      )}
      {/* </View> */}
    </FormLayout>
  );
}
