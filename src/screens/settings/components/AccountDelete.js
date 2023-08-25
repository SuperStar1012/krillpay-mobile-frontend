import React, { useState } from 'react';
import { View, Button, Text } from 'components';
import { requestAccDelete } from 'utility/rehive';
import { useRehiveContext } from 'contexts';
import ErrorOutput from 'components/outputs/ErrorOutput';

export default function AccountDelete() {
  const [result, setResult] = useState(null);
  const { user, company } = useRehiveContext();
  const [loading, setLoading] = useState(null);

  async function handleAccDeleteRequest() {
    setLoading(true);
    const data = {
      user: user?.id,
      company: company?.id,
    };
    const resp = await requestAccDelete(data);
    setResult(resp);
    setLoading(false);
  }
  if (result?.status === 'success')
    return (
      <View pb={1.5}>
        <Text id="acc_delete_success" tA="center" />
      </View>
    );
  if (result?.status === 'error')
    return (
      <View pb={1.5}>
        <View pb={0.5}>
          <Text id="acc_delete_error" tA="center" />
        </View>
        <ErrorOutput>{result?.message}</ErrorOutput>
      </View>
    );

  return (
    <View>
      <View pb={1.5}>
        <Text id="acc_delete_confirm" tA="center" />
      </View>
      <Button
        id="continue"
        wide
        onPress={handleAccDeleteRequest}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
}
