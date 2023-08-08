import React, { useState } from 'react';
import { View, Button, EmptyListMessage, Text, Spinner } from 'components';
import { getUserLocales, updateProfile } from 'utility/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useQuery } from 'react-query';
import { useKeyboard } from 'hooks/keyboard';
import { Pressable } from 'react-native';
import { changeLanguage, language as appLanguage } from 'i18next';
import { localeKeys } from 'utility/i18n/locales';
import { useToast } from 'contexts';
import { uniq } from 'lodash';
import { arrayToObject } from 'utility/general';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { useDispatch } from 'react-redux';
import { updateReduxUser } from '@redux/actions';
import LanguageRestartModal from 'components/modals/LanguageRestartModal';

// function getCountryEmoji(countryCode) {
//   const flagOffset = 0x1f1e6;
//   const asciiOffset = 0x41;

//   const firstChar = countryCode.charCodeAt(0) - asciiOffset + flagOffset;
//   const secondChar = countryCode.charCodeAt(1) - asciiOffset + flagOffset;

//   const flag =
//     countryCode.charCodeAt(firstChar) + countryCode.charCodeAt(secondChar);
//   return flag;
// }

// let languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

export default function LanguageInput(props) {
  const {
    context: { company },
  } = useRehiveContext();

  const { showToast } = useToast();

  const [language, setLanguage] = useState(appLanguage);
  const [isSubmitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery(
    [company?.id, 'locales'],
    getUserLocales,
    {
      enabled: true,
    },
  );

  const hasLocales = data?.results?.length > 0;
  const availableLanguages = uniq([
    ...(localeKeys?.length > 0 ? localeKeys : []),
    ...(hasLocales ? data?.results.map(item => item?.id) : []),
  ]); //i18n?.store?.data
  const isDifferent = appLanguage !== language;

  const dispatch = useDispatch();

  async function setUserLanguage() {
    const resp = await updateProfile({ language });
    dispatch(updateReduxUser(resp));
  }

  const { keyboardHeight } = useKeyboard();

  async function handleChangeLanguage() {
    setSubmitting(true);
    await changeLanguage(language);
    setUserLanguage();
    setSubmitting(false);
    showToast({ id: 'language_updated', type: 'success' });
  }

  const dataObj = arrayToObject(data?.results ?? []);

  return (
    <View f={1}>
      <View f={1} scrollView>
        <View pb={4}>
          {isLoading ? (
            <Spinner />
          ) : !availableLanguages?.length > 0 ? (
            <EmptyListMessage id="language" />
          ) : (
            availableLanguages.map(item => (
              <LanguageOption
                key={item}
                id={item}
                selected={language === item}
                setLanguage={setLanguage}
                data={dataObj}
              />
            ))
          )}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          bottom: 8 + keyboardHeight,
          left: 0,
          width: '100%',
        }}>
        <LanguageRestartModal />
        <Button
          color={'primary'}
          id="update_app_language"
          loading={isSubmitting}
          wide
          onPress={handleChangeLanguage}
          disabled={!isDifferent || isSubmitting}
        />
      </View>
    </View>
  );
}

function LanguageOption(props) {
  const { id, selected, setLanguage, data } = props;
  const item = data?.[id] ?? {};

  const { name = id === 'en' ? 'English (default)' : id, icon } = item;

  function handleLanguage() {
    setLanguage(id);
  }

  return (
    <Pressable onPress={handleLanguage}>
      <View pv={0.5} fD="row" aI="center">
        <CurrencyBadge currency={{ icon }} text={id} />
        <View pl={1}>
          <Text c={selected ? 'primary' : 'font'} fW={selected ? '500' : '400'}>
            {name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
