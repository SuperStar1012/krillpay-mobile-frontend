import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, Animated } from 'react-native';

import { View } from './View';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { EmptyListMessage } from '../outputs/EmptyListMessage';
import Header from './header';

const ResourceList = props => {
  const {
    renderItem,
    title,
    navigation,
    renderDetail,
    fetchData,
    renderEdit,
    allowAdd,
    ...restProps
  } = props;

  const [id, setId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [next, setNext] = useState('');
  const [error, setError] = useState('');

  const hasScreenHeader = Boolean(title && navigation);

  function handleReset() {
    setId('');
    setEditing(false);
    handleRefresh();
  }
  function handleRefresh() {
    handleFetchData();
  }

  async function handleFetchData() {
    if (fetchData) {
      try {
        const resp = await fetchData();
        const { status, data, message } = resp;
        if (status === 'success' && data) {
          const { results, next } = data;
          setItems(results ? results : data);
          setNext(next);
        } else {
          setError(message ? message : 'Something went wrong...');
        }
      } catch (e) {
        console.log('handleFetchData -> e', e);
        setError('Something went wrong...');
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFetchData();
  }, []);

  function showDetail(id) {
    setId(id);
  }

  function hideDetail() {
    setEditing(false);
    setId('');
  }
  // const [value] = useState(new Animated.Value(0));

  // useEffect(() => {
  //   // if (id) {
  //   Animated.timing(value, {
  //     toValue: id ? 1 : 0,
  //     duration: 1000,
  //   }).start(); // < Don't forget to start!}
  //   // }
  // }, [id]);

  return (
    <View f={1}>
      {editing && renderEdit ? (
        <View>
          <Header
            customBackFunc={hideDetail}
            back
            customBack
            title={id ? 'Edit' : 'Add'}
            // headerRightIcon={'add'} //emails.showDetail ? 'done' :
            // headerRightOnPress={() => setEditing(true)}
          />
          {renderEdit(id, { handleReset })}
        </View>
      ) : id && renderDetail ? (
        <>
          <Header customBackFunc={hideDetail} back inverted customBack />
          {renderDetail(id, { handleReset })}
        </>
      ) : (
        <React.Fragment>
          {hasScreenHeader && (
            <Header
              navigation={navigation}
              back
              title="Devices"
              headerRightIcon={
                allowAdd && items && allowAdd(items) ? 'add' : ''
              }
              headerRightOnPress={() => setEditing(true)}
            />
          )}
          {/* {header ? <CardListHeader header={header} /> : null} */}
          <FlatList
            contentContainerStyle={{ padding: 18 }}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
            keyboardShouldPersistTaps={'handled'}
            data={items}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => showDetail(item)}>
                <View mb={1}>{renderItem(item, index)}</View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<EmptyListMessage>No items</EmptyListMessage>}
            keyExtractor={item => (item.id ? item.id.toString() : '0')}
            // ListEmptyComponent={
            //   !loading && (
            //     <EmptyListPlaceholderImage name={type} text={emptyListMessage} />
            //   )
            // }
            // ListHeaderComponent={renderHeader ? renderHeader : null}
            // ListFooterComponent={
            //   <PaginationListFooter
            //     next={more && !loading}
            //     loading={nextLoading}
            //     getNext={getNext}
            //   />
            // }
            // {...restProps}
          />
        </React.Fragment>
      )}
    </View>
  );
};

// ResourceList.defaultProps = {
//   onRefresh: () => {},
//   horizontal: false,
// };

// ResourceList.propTypes = {
//   onRefresh: PropTypes.func,
//   horizontal: PropTypes.bool,
// };

export { ResourceList };
