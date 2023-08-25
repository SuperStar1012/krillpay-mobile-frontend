import { useRef, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRehiveContext } from 'contexts';
import { I18nManager } from 'react-native';

export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

export function useDimissed(id) {
  const {
    context: { user, company },
  } = useRehiveContext();

  const [dismissed, setDismissed] = useState({});
  const [loading, setLoading] = useState(true);

  // get user's dismissed data
  const companyDismissed = dismissed?.[company?.id] ?? {};
  const userDismissed = companyDismissed?.[user?.id] ?? {};

  // load dimissed value from async store
  async function load() {
    let tempDismissed = await AsyncStorage.getItem('dismissed');
    setDismissed(tempDismissed ? JSON.parse(tempDismissed) : {});
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  // function to update dismissed
  async function dismiss(value = true) {
    if (id) {
      const newDismissed = {
        ...dismissed,
        [company?.id]: {
          ...companyDismissed,
          [user?.id]: { ...userDismissed, [id]: value },
        },
      };
      await setDismissed(newDismissed);
      await AsyncStorage.setItem('dismissed', JSON.stringify(newDismissed));
    }
  }

  return {
    dismissed: id ? userDismissed?.[id] ?? false : dismissed,
    dismiss,
    loading,
  };
}

export function useIsRTL() {
  // const { i18n } = useTranslation();
  // const isRTL = i18n.dir() === 'rtl';
  return I18nManager.isRTL;
}

export function useToggle(initialState = false) {
  const [value, setValue] = useState(initialState);

  function setFalse() {
    setValue(false);
  }

  function setTrue(value = true) {
    setValue(value);
  }

  return { value, setFalse, setTrue };
}

export function useModal(initialState = false) {
  const { value, setFalse, setTrue } = useToggle(initialState);

  return { modalVisible: value, hideModal: setFalse, showModal: setTrue };
}
