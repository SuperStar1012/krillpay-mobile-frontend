import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { I18nManager } from 'react-native';

export default function CardGradient(props) {
  return (
    <LinearGradient
      start={I18nManager.isRTL ? [1, 0] : [0, 0]}
      end={[I18nManager.isRTL ? [0, 0] : 1, 0]}
      colors={['rgba(256,256,256,0)', 'rgba(256,256,256,1)']}
      style={{
        width: 70,
        height: '100%',
        position: 'absolute',
        right: 32,
      }}
    />
  );
}
