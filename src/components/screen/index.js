import React, { useState, useEffect } from 'react';
// import Layout from './Layout';
// import Toast, { showToast } from 'components/outputs/Toast';
import { LanguageContext } from 'contexts/LanguageContext';

export default function Screen(props) {
  const { locales, config } = props;

  const { pages, screen } = config;
  // const { scr, form, detail } = components;

  // add navigator here
  return (
    <LanguageContext.Provider value={locales}>
      {/* <Toast /> */}
      {/* <Modal
        fullScreen
        close
        backgroundColor="#B7B7B7"
        maxWidth={10000}
        open={Boolean(modal)}
        onDismiss={() => setModal('')}>
        <Modals id={modal} data={data} item={item} values={values} />
      </Modal> */}
    </LanguageContext.Provider>
  );
}
