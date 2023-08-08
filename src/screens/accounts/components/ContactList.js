import React, { useEffect, createRef } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { intersection } from 'lodash';
import { View } from 'components/layout/View';
import { Text } from 'components/outputs/Text';
import ContactListItem from './ContactListItem';
import { useContacts } from 'contexts/ContactsContext';

export default function ContactList(props) {
  const { searchTerm, onSelect, containerStyle } = props;

  const { context: contacts } = useContacts();
  const listRef = createRef();

  const style = StyleSheet.create({
    list: {
      ...containerStyle,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      overflow: 'hidden',
      paddingBottom: 4,
    },
    listTitle: {
      fontWeight: '600',
      fontSize: 18,
      paddingLeft: 10,
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

  function renderContacts() {
    let all = contacts.phone;
    let recent = contacts.recent;

    if (!all && !recent) return [];

    if (searchTerm) {
      all = all.filter(item => {
        if (!item.contact) return false;
        return (
          item.name.toLowerCase().includes(searchTerm) ||
          item.contact.includes(searchTerm)
        );
      });

      recent = intersection(all, recent);
    }

    let sections = [];

    if (all.length)
      sections.push({
        id: 'contacts',
        data: all,
      });

    if (recent.length)
      sections.push({
        id: 'recent',
        data: recent,
      });

    return sections;
  }

  function handleContactSelect(item) {
    typeof onSelect === 'function' &&
      onSelect({ contact: item.contact, type: item.type });
    // setFieldValue('recipient', item.contact);
    // setFieldValue('recipientType', item.type);
    // setFieldTouched('recipient');
    // setState('');
  }

  return (
    <View>
      <SectionList
        ref={listRef}
        onStartShouldSetResponder={true}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="always"
        style={style.list}
        contentContainerStyle={{
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          overflow: 'hidden',
        }}
        sections={renderContacts()}
        renderItem={({ item }) => (
          <ContactListItem
            key={item.id}
            onPress={() => handleContactSelect(item)}
            title={item.name ? item.name : ''}
            subtitle={item.contact ? item.contact : ''}
            image={item.image ? item.image : null}
            type={item.type}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={style.listTitle}>{section.title}</Text>
        )}
        keyExtractor={item => (item.id ? item.id.toString() : '')}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
