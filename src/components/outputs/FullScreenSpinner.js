import React from 'react';
import { Spinner } from './Spinner';

export default function FullScreenSpinner({ isLoading, children }) {
  return (
    <>
      {isLoading && (
        <Spinner
          containerStyle={{
            position: 'absolute',
            flex: 1,
            zIndex: 10,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffffcc',
          }}
        />
      )}
      {children}
    </>
  );
}
