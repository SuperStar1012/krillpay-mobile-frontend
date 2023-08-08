import React from 'react';
import { useBusiness } from 'contexts';
import BusinessAvatar from './BusinessAvatar';
import { View } from 'components';
import { Icon } from 'components/outputs/Icon';
import { Pressable } from 'react-native';
import { useModal } from 'utility/hooks';

export default function BusinessSelector(props) {
  const { business, businesses, loading, setBusinessId } = useBusiness();

  const { showModal, hideModal, modalVisible } = useModal();

  function handleChange(item) {
    setBusinessId(item?.id);
    hideModal();
  }

  return (
    <Pressable onPress={modalVisible ? hideModal : showModal}>
      <View fD="row" w="100%" jC="space-between" pr={1}>
        <BusinessAvatar
          context={{ business }}
          loading={loading}
          imageSize={28}
        />
        <Icon
          size={24}
          set="MaterialIcons"
          name={modalVisible ? 'arrow-drop-up' : 'arrow-drop-down'}
        />
        {modalVisible && (
          <View
            style={{
              top: 32,
              elevation: 10,
              position: 'absolute',
              width: '100%',
              shadowOffset: {
                width: 2,
                height: -2,
              },
              shadowOpacity: 0.3,
              backgroundColor: 'white',
              shadowRadius: 5,
              borderRadius: 15,
              // overflow: 'hidden',
            }}>
            <View w="100%" bR={15}>
              {businesses?.map(item => (
                <Pressable key={item?.id} onPress={() => handleChange(item)}>
                  <View
                    p={0.5}
                    w="100%"
                    bC={business?.id === item?.id ? '#EEEEEE' : 'white'}>
                    <BusinessAvatar
                      context={{ business: item }}
                      imageSize={28}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

{
  /* <List style={{ width: '100%' }}>
          {businesses?.map(item => (
            <BusinessListItem
              key={item?.id}
              item={item}
              selected={item?.id === business?.id}
              setBusinessId={setBusinessId}
              handleClose={handleClose}
            />
          ))}
        </List> */
}

// function BusinessListItem(props) {
//   const { item, selected, setBusinessId, handleClose } = props;

//   function handleClick() {
//     setBusinessId(item?.id);
//     handleClose();
//   }
//   return (
//     <ListItem selected={selected} button dense onClick={handleClick}>
//       <UserAvatar context={{ business: item }} />
//     </ListItem>
//   );
// }

// const useStyles = makeStyles(theme => ({
//   row: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     // width,
//   },
// }));
