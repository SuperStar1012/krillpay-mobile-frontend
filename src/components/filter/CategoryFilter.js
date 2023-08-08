import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { View } from '../layout/View';
import { Spinner } from '../outputs/Spinner';
// import CheckboxMultiList from '../inputs/CheckboxMultiList';
import { EmptyListMessage } from '../outputs/EmptyListMessage';

import { Dimensions, Pressable } from 'react-native';
import { useQuery } from 'react-query';
import { useRehiveContext } from 'contexts';
import { getProductCategories } from 'utility/rehive';
import RadioMultiList from 'components/inputs/RadioMultiList';
import Text from 'components/outputs/Text';
const SCREEN_HEIGHT = Dimensions.get('window').height;

function CategoryFilter(props) {
  const { id = 'categories', context } = props;
  const { filters, setFilters } = context;
  const { company } = useRehiveContext();
  const [open, setOpen] = useState([]);

  const { data, isLoading } = useQuery(
    [company?.id, 'product-categories'],
    getProductCategories,
    { enabled: true },
  );

  const categories = data?.results;

  const [tempFilters, setTempFilters] = useState(filters);

  const setValue = value => {
    if (value && value.length && value.length > 0) {
      setTempFilters({
        ...tempFilters,
        [id]: value,
      });
    } else {
      const tempFilters2 = { ...tempFilters };
      delete tempFilters2[id];
      setTempFilters(tempFilters2);
    }
  };

  useEffect(() => {
    let timer = null;
    timer = setTimeout(() => {
      setFilters(tempFilters);
    }, 500);

    return () => clearTimeout(timer);
  }, [tempFilters]);

  function handleClear() {
    setValue([]);
    setOpen([]);
  }

  return (
    <>
      <View fD="row" jC="space-between" pt={0.5}>
        <Text c="fontDark" s={20} fW="500">
          Categories
        </Text>
        {(open?.length || tempFilters?.categories?.length) && (
          <Pressable onPress={handleClear}>
            <Text
              id="clear"
              c="primary"
              style={{ textDecorationLine: 'underline' }}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.container} pt={0.5}>
        {isLoading ? (
          <Spinner />
        ) : categories?.length > 0 ? (
          <View scrollView>
            <RadioMultiList
              openable
              items={categories}
              parent={''}
              setValue={setValue}
              open={open}
              values={tempFilters?.categories ?? []}
              setOpen={setOpen}
            />
          </View>
        ) : (
          <EmptyListMessage>No available categories</EmptyListMessage>
        )}
      </View>
    </>
  );
}
const styles = {
  container: {
    width: '100%',
    height: SCREEN_HEIGHT - (100 + Constants.statusBarHeight),
  },
  title: {
    paddingTop: 10,
  },
};

export default React.memo(CategoryFilter);
