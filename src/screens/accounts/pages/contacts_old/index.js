import React, { useState, useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import { SectionList, StyleSheet, TouchableHighlight } from 'react-native';
import { intersection, get } from 'lodash';
import { View, Text, TextField } from 'components';
import Header from 'components/layout/header';
import { configActionsSelector } from '@redux/rehive/selectors';
import { useTheme } from 'components/context';
import { arrayToPlaceholder } from 'utility/general';
import ContactListItem from './ContactListItem';
import { useContacts } from 'contexts/ContactsContext';

export default function ContactList(props) {
  const { containerStyle, navigation } = props;
  const { colors } = useTheme();

  const {
    pageTitle,
    backFunc,
    onSelect,
    currency,
    action = 'send',
  } = get(navigation, ['state', 'params'], {});

  const [searchTerm, setSearchTerm] = useState();

  const { context: contacts } = useContacts();
  const actionsConfig = useSelector(configActionsSelector);
  const listRef = createRef();

  const recipients = actionsConfig?.[action]?.config?.recipient;
  const placeholderRecipients = ['name', ...recipients].filter(x =>
    currency?.crypto ? x : x !== 'crypto',
  );

  const placeholder = arrayToPlaceholder(placeholderRecipients);

  const style = StyleSheet.create({
    list: {
      ...containerStyle,
      overflow: 'hidden',
      paddingBottom: 4,
    },
  });

  useEffect(() => {
    if (listRef.current.props.sections.length)
      listRef.current.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,
        animated: false,
      });
  }, [searchTerm]);

  function contactSections() {
    let all = contacts.phone;
    let recent = contacts.recent;

    if (!all && !recent) return [];

    if (searchTerm) {
      all = all.filter(item => {
        if (!item.contact) return false;
        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contact.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      recent = intersection(all, recent);
    }

    let sections = [];

    if (all.length)
      sections.push({
        title: 'Contacts',
        data: all,
      });

    if (recent.length)
      sections.push({
        title: 'Recent',
        data: recent,
      });

    return sections;
  }

  function handleContactSelect(item) {
    typeof onSelect === 'function' &&
      onSelect({ contact: item.contact, type: item.type });
    navigation.goBack();
    // setFieldValue('recipient', item.contact);
    // setFieldValue('recipientType', item.type);
    // setFieldTouched('recipient');
    // setState('');
  }

  return (
    <View screen header>
      <Header
        navigation={navigation}
        customBack={backFunc}
        customBackFunc={backFunc}
        back
        title={pageTitle || 'Select contact'}
      />
      <View mv={1} f={1}>
        <View ph={1} mb={1}>
          <TextField
            label={placeholder}
            value={searchTerm}
            multiline={false}
            onChangeText={value => setSearchTerm(value)}
            tintColor={colors.primary}
          />
        </View>
        <View f={1}>
          <SectionList
            ref={listRef}
            onStartShouldSetResponder={true}
            stickySectionHeadersEnabled={true}
            keyboardShouldPersistTaps="always"
            style={style.list}
            contentContainerStyle={{
              overflow: 'hidden',
            }}
            sections={contactSections()}
            renderItem={({ item }) => (
              <TouchableHighlight
                underlayColor={'#EFEFEF'}
                style={{ padding: 0 }}
                onPress={() => handleContactSelect(item)}>
                <View ph={1} pv={0.5}>
                  <ContactListItem
                    key={item.id}
                    // onPress={() => handleContactSelect(item)}
                    title={item.name ? item.name : ''}
                    subtitle={item.contact ? item.contact : ''}
                    image={item.image ? item.image : null}
                    type={item.type}
                  />
                </View>
              </TouchableHighlight>
            )}
            renderSectionHeader={({ section }) => (
              <View ml={1} pb={1} bC={'white'}>
                <Text s={18} fW={'bold'}>
                  {section.title}
                </Text>
              </View>
            )}
            keyExtractor={item => (item.id ? item.id.toString() : '')}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}
