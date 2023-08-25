import React, { useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import { SectionList, StyleSheet, TouchableHighlight } from 'react-native';
import { intersection } from 'lodash';
import { View, Text, TextField } from 'components';
import { configActionsSelector } from '@redux/rehive/selectors';
import { useTheme } from 'components/context';
import { arrayToPlaceholder, standardizeString } from 'utility/general';
import ContactListItem from './ContactListItem';
import { useContacts } from 'contexts/ContactsContext';
import CustomRecipient from './CustomRecipient';
import PageContent from 'components/layout/PageContent';
import { getRecipientType } from 'screens/accounts/util/validation';
import MobileInput from 'components/inputs/MobileInput';
import { useTranslation } from 'react-i18next';

export default function ContactList(props) {
  const {
    containerStyle,
    onSelect,
    wallet,
    pageId = 'send',
    form,
    config,
    context,
  } = props;
  const { colors } = useTheme();

  useEffect(() => {
    form.register('searchTerm');
    form.register('memo');
    form.register('memoSkip');
  }, [form.register]);
  const setSearchTerm = value => form.setValue('searchTerm', value);

  const { recipient, searchTerm } = form.watch();

  useEffect(() => {
    setSearchTerm(recipient);
  }, [recipient]);
  const wyreCrypto = context?.wyreCurrency?.wyre_currency_code_for_deposit;
  const type = getRecipientType(searchTerm, wallet, wyreCrypto);

  const actionsConfig = useSelector(configActionsSelector);
  const listRef = createRef();

  const recipientTypes = intersection(
    actionsConfig?.[pageId]?.config?.recipient ?? ['email', 'mobile'],
    config?.types,
  );
  const { context: contacts } = useContacts(recipientTypes);

  const { t } = useTranslation('common');
  const placeholderRecipients = ['name', ...recipientTypes]
    .filter(x => (wallet?.crypto || wyreCrypto ? x : x !== 'crypto'))
    .map(item => t(item));

  const placeholder = standardizeString(
    arrayToPlaceholder(placeholderRecipients, {
      crypto: wallet?.crypto,
    }).toLowerCase(),
  );

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
        title: 'contacts',
        data: all,
      });

    if (recent.length)
      sections.push({
        title: 'recent',
        data: recent,
      });

    return sections;
  }

  function handleContactSelect(item) {
    typeof onSelect === 'function' && onSelect(item);
  }

  const isMobileSupported = recipientTypes.includes('mobile');

  const isTypeSupported =
    recipientTypes.findIndex(item => item === type) !== -1;

  const isMobile = isMobileSupported && searchTerm?.[0] === '+';

  function handleOnChange(value) {
    setSearchTerm(value);
  }

  return (
    <View f={1}>
      <PageContent>
        {isMobile ? (
          <MobileInput value={searchTerm} onChangeText={handleOnChange} />
        ) : (
          <TextField
            label={placeholder}
            value={searchTerm}
            multiline={false}
            onChangeText={handleOnChange}
            tintColor={colors.primary}
          />
        )}
      </PageContent>

      {isTypeSupported && (
        <CustomRecipient
          {...props}
          value={searchTerm}
          type={type}
          label={config?.actionLabel ?? ''}
          onSelect={handleContactSelect}
          wallet={wallet}
        />
      )}

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
              <View ph={1.5} pv={0.5}>
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
            <View ph={1.5} pb={0.5} bC={'white'}>
              <Text s={18} fW={'bold'} id={section.title} />
            </View>
          )}
          keyExtractor={item => (item.id ? item.id.toString() : '')}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
