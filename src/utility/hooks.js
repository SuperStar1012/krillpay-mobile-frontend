import React, { useState } from 'react';

function useToggle(initialState = false) {
  const [value, setValue] = useState(initialState);

  function setFalse() {
    setValue(false);
  }

  function setTrue(value = true) {
    setValue(value);
  }

  return { value, setFalse, setTrue };
}

function useModal(initialState = false) {
  const { value, setFalse, setTrue } = useToggle(initialState);

  return { modalVisible: value, hideModal: setFalse, showModal: setTrue };
}

export { useToggle, useModal };
