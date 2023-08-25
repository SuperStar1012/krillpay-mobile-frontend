import React, { useState, useEffect, useMemo } from 'react';
import { throttle } from 'lodash';
import { getPlacePredictions, getPlaceDetails } from '../../utility/rehive';
import Text from '../outputs/Text';
import SearchModal from '../modals/SearchModal';

export default function LocationInput(props) {
  const {
    label,
    onChange,
    setAwaiting,
    value,
    prefix = '',
    ...restProps
  } = props;

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedOption) getDetails();
  }, [selectedOption]);

  useEffect(() => {
    if (typeof value === 'string') onChange(value);
  }, [value]);

  function handleChange(place) {
    if (!place) {
      if (onChange) onChange(null);
      return;
    }

    let formattedAddress = {
      [`${prefix}line_1`]: [],
      [`${prefix}line_2`]: '',
      [`${prefix}city`]: '',
      [`${prefix}state_province`]: '',
      [`${prefix}country`]: '',
      [`${prefix}postal_code`]: '',
    };

    place.address_components.forEach(item => {
      function contains(term) {
        return item.types.includes(term);
      }

      switch (true) {
        case contains('street_number'):
        case contains('route'):
          formattedAddress[`${prefix}line_1`].push(item.long_name);
          break;
        case contains('neighborhood'):
          formattedAddress[`${prefix}line_2`] = item.long_name;
          break;
        case contains('locality'):
          formattedAddress[`${prefix}city`] = item.long_name;
          break;
        case contains('administrative_area_level_1'):
          formattedAddress[`${prefix}state_province`] = item.long_name;
          break;
        case contains('country'):
          formattedAddress[`${prefix}country`] = item.short_name;
          break;
        case contains('postal_code'):
          formattedAddress[`${prefix}postal_code`] = item.long_name;
          break;
        default:
      }
    });

    formattedAddress[`${prefix}line_1`] = formattedAddress[
      `${prefix}line_1`
    ].join(' ');

    if (onChange) onChange(formattedAddress);
  }

  async function getDetails() {
    setAwaiting && setAwaiting(true);
    setFetching(true);

    getPlaceDetails(selectedOption.place_id).then(resp => {
      handleChange(resp?.data?.result);
      setAwaiting && setAwaiting(false);
      setFetching(false);
    });
  }

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        setLoading(true);

        getPlacePredictions(request.input).then(resp => {
          callback(resp?.data?.predictions);
        });
      }, 200),
    [],
  );

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions([]);
      setLoading(false);
      return undefined;
    }

    fetch({ input: inputValue }, results => {
      if (active) {
        let newOptions = [];

        if (results) {
          newOptions = [...results, ...newOptions];
        }

        newOptions = newOptions
          .filter(x => typeof x !== 'string')
          .map(option => {
            return {
              ...option,
              id: option.place_id,
              value: option.description,
            };
          });

        setOptions(newOptions);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  function stringifyLocationObject(object) {
    return [
      object[`${prefix}line_1`],
      object[`${prefix}line_2`],
      object[`${prefix}city`],
      object[`${prefix}state_province`],
      object[`${prefix}country`],
      object[`${prefix}postal_code`],
    ]
      .filter(x => x)
      .join(', ');
  }

  const searchModalProps = {
    label,
    items: options,
    value,
    displayValue:
      !value || typeof value === 'string'
        ? value
        : stringifyLocationObject(value),
    setValue: newValue => {
      const selectedOption = options.find(x => x.id === newValue);
      setSelectedOption(selectedOption);
    },
    onSearch: ({ search }) => setInputValue(search),
    input: true,
    loading,
    inputChildren: fetching ? <Text s={12}>Fetching details...</Text> : null,
    textFieldProps: {
      multiline: true,
      numberOfLines: 2,
      ellipsizeMode: 'tail',
    },
    ...restProps,
  };

  return <SearchModal {...searchModalProps} />;
}
