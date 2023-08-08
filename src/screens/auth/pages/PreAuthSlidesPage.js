import React, { useEffect } from 'react';
import { FullScreenForm, Slides } from 'components';
import client from 'config/client';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useIsRTL } from 'hooks/general';

export default function PreAuthSlidesPage(props) {
  const { onSuccess, setLoading, onBack } = props;

  const isRTL = useIsRTL();
  const {
    config: { slidersConfig },
  } = useRehiveContext();
  const slides = slidersConfig?.preAuth ?? [];

  useEffect(() => {
    if (slides.length === 0) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, [slides]);

  return (
    <FullScreenForm
      type="auth"
      iconHeaderLeft={
        client.company ? '' : isRTL ? 'chevron-right' : 'chevron-left'
      }
      onPressHeaderLeft={onBack}
      textHeaderRight={'skip'}
      onPressHeaderRight={onSuccess}>
      <Slides items={slides} fullScreen onSuccess={onSuccess} />
    </FullScreenForm>
  );
}
