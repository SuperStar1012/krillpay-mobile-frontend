import React, { useEffect, createRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  SectionList,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { intersection } from 'lodash';
import { View, Text, TextField } from 'components';
import { configActionsSelector } from '@redux/rehive/selectors';
import { useTheme } from 'components/context';
import {
  arrayToPlaceholder,
  standardizeString,
  krilltagSearch,
} from 'utility/general';
import ContactUtil from 'utility/contacts';
import ContactListItem from './ContactListItem';
// import { useContacts } from 'contexts/ContactsContext';
import CustomRecipient from './CustomRecipient';
import PageContent from 'components/layout/PageContent';
import { getRecipientType } from 'screens/accounts/util/validation';
import MobileInput from 'components/inputs/MobileInput';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

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
  const [refreshing, setRefreshing] = useState(false);
  const [contacts, setcontacts] = useState(false);
  const navigation = useNavigation();
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

  // let { context: contacts } = useContacts(
  //   recipientTypes,
  // );

  useEffect(() => {
    fetchingContacts(null);
  }, []);
  const openSettingsHandler = useCallback(() => {
    Alert.alert(
      '',
      'We could not fetch your contacts. Please allow contacts permission from Settings to send money',
      [
        {
          text: 'Go Back',
          onPress: () => {
            navigation.goBack();
          },
        },
        {
          text: 'Open Settings',
          onPress: () => {
            navigation.goBack();
            Linking.openSettings();
          },
        },
      ],
      { cancelable: false },
    );
  }, []);

  const fetchingContacts = async handleRefresh => {
    try {
      const response = await ContactUtil.getAllContacts(
        recipientTypes,
        handleRefresh,
      );
      if (Object.keys(response).length == 3) {
        setcontacts(response);
        setRefreshing(false);
      } else {
        openSettingsHandler();
      }
    } catch (e) {
      //setError
    }
  };

  const { t } = useTranslation('common');
  const placeholderRecipients = ['name', ...recipientTypes]
    .filter(x => (wallet?.crypto || wyreCrypto ? x : x !== 'crypto'))
    .map(item => t(item));
  const placeholder = standardizeString(
    arrayToPlaceholder(placeholderRecipients, {
      crypto: wallet?.crypto,
    }),
  );

  const style = StyleSheet.create({
    list: {
      ...containerStyle,
      overflow: 'hidden',
      paddingBottom: 4,
    },
  });

  useEffect(() => {
    if (listRef.current && listRef.current.props.sections.length)
      listRef.current.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,
        animated: false,
      });
  }, [searchTerm]);

  const onRefresh = () => {
    fetchingContacts(true);
    setRefreshing(true);
  };

  function contactSections() {
    let phone_contacts = contacts.contacts ? contacts.contacts : [];

    let suggested = contacts.suggested ? contacts.suggested : [];
    let krillPayContacts = contacts.krillpayUsers ? contacts.krillpayUsers : [];
    let combineContact = krillPayContacts.filter(
      val => !suggested.includes(val),
    );

    let recent = contacts.recent;
    if (!suggested && !recent) return [];
    if (searchTerm && searchTerm.startsWith('@')) {
      krillPayContacts = krillPayContacts.filter(item => {
        if (!item.contact) return false;
        return (
          item.username.toLowerCase().includes(krilltagSearch(searchTerm)) ||
          item.name.toLowerCase().includes(krilltagSearch(searchTerm)) ||
          item.email.toLowerCase().includes(krilltagSearch(searchTerm))
        );
      });
    } else {
      if (searchTerm) {
        combineContact = combineContact.filter(item => {
          if (!item.contact) return false;
          return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.contact.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      } else {
        suggested = suggested.filter(item => {
          if (!item.contact) return false;
          return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.contact.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }

      phone_contacts = phone_contacts.filter(item => {
        if (!item.contact) return false;
        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contact.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      recent = intersection(suggested, recent);
    }

    if (searchTerm && searchTerm.startsWith('@')) {
      let krill_list = [];
      if (krillPayContacts.length) {
        krill_list.push({
          title: 'krillpay_contacts',
          data: krillPayContacts,
        });
      }
      return krill_list;
    } else {
      let sections = [];
      if (searchTerm) {
        if (combineContact.length) {
          sections.push({
            title: 'suggested',
            data: combineContact,
          });
        }
      } else {
        if (suggested.length) {
          sections.push({
            title: 'suggested',
            data: suggested,
          });
        }
      }
      if (krillPayContacts.length) {
        sections.push({
          title: 'contacts',
          data: phone_contacts,
        });
      }

      if (recent.length) {
        sections.push({
          title: 'recent',
          data: recent,
        });
      }
      return sections;
    }
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
    <>
      {contactSections().length > 0 ? (
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
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              sections={contactSections()}
              renderItem={({ item, index }) => (
                <TouchableHighlight
                  underlayColor={'#EFEFEF'}
                  style={{ padding: 0 }}
                  onPress={() => {
                    handleContactSelect(item);
                  }}>
                  <View ph={1.5} pv={0.5}>
                    <ContactListItem
                      key={item.contact + index}
                      // onPress={() => handleContactSelect(item)}
                      title={item.name ? item.name.trim() : ''}
                      subtitle={item.contact ? item.contact : ''}
                      image={item.image ? item.image : null}
                      type={item.type}
                      krilltag={item.username ? item.username : ''}
                      nationality={item.nationality ? item.nationality : ''}
                    />
                  </View>
                </TouchableHighlight>
              )}
              renderSectionHeader={({ section }) => (
                <View ph={1.5} pb={0.5} bC={'white'}>
                  <Text s={18} fW={'bold'} id={section.title} />
                </View>
              )}
              keyExtractor={item =>
                item.contact ? item.contact.toString() : ''
              }
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : !contactSections()?.length && searchTerm?.length ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Contact Not Found!</Text>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={'large'} color={'#043c8c'} />
        </View>
      )}
    </>
  );
}
