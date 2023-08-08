import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'components';
import { standardizeString } from 'utility/general';
import client from 'config/client';
import * as SecureStore from 'expo-secure-store';

export default function Disclaimer(props) {
  let { title, company, hideOverride } = props;
  const [dismissed, setDismissed] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const tempDismissed = await SecureStore.getItemAsync(
        'dismissedDisclaimer',
      );
      setDismissed(JSON.parse(tempDismissed ?? '{}'));
      setLoading(false);
    }

    fetchData();
  }, []);

  if (!company) return null;
  let { id = '' } = company ?? {};
  if (!company || !company.name) {
    company.name = standardizeString(company?.id ?? '');
  }

  function handleDismiss() {
    const tempDismissed = { ...(dismissed ?? {}), [id]: true };
    setDismissed(tempDismissed);
    const value = JSON.stringify(tempDismissed);
    SecureStore.setItemAsync('dismissedDisclaimer', value);
  }

  if (
    client?.company ||
    hideOverride ||
    dismissed?.[id] ||
    loading ||
    !company
  ) {
    return null;
  }
  return (
    <View
      p={1}
      w="100%"
      style={
        title
          ? {}
          : {
              backgroundColor: 'rgba(0,0,0,0.67)',
              zIndex: 100,
              bottom: 0,
              position: 'absolute',
            }
      }>
      {title && (
        <Text
          tA="center"
          s={14}
          p={0.25}
          c="#585858"
          fW="500"
          id="disclaimer_title"
        />
      )}
      <View aI="center" fD="column">
        <Text tA="center" lH={17} c={title ? 'grey4' : '#FFF'}>
          <Text
            fW="700"
            s={12}
            c={title ? 'grey4' : '#FFF'}
            id="disclaimer_prefix"
          />
          <Text
            s={12}
            c={title ? 'grey4' : '#FFF'}
            id="disclaimer_text"
            context={{ company }}></Text>
        </Text>
        {!Boolean(title) && (
          <View pt={0.5}>
            <Button
              id="accept"
              // type="text"
              size="small"
              onPress={handleDismiss}
              // color="white"
              color="#222222"
            />
          </View>
        )}
      </View>
    </View>
  );
}
