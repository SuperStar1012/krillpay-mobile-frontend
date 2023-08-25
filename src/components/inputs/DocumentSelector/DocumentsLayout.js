import React from 'react';
import { View } from 'components/layout/View';
import { Text } from 'components';
import Images from '../../images';
import IconButton from 'components/inputs/IconButton';
import { useModal } from 'utility/hooks';
import { PopUpGeneral } from '../../layout/PopUpGeneral';
import { standardizeString } from 'utility/general';
import ProfileHelpModal from '../../layout/ProfileHelpModal';
import { HeaderBackButton } from 'components/layout/HeaderNew';

export default function DocumentsLayout(props) {
  const {
    config = {},
    children,
    handleBack,
    navigation,
    state,
    index,
    configs,
    listType,
    noPadding,
    noBack,
    hideDescription,
    id,
    page,
  } = props;

  let {
    image,
    description = id + '_description',
    title = id + '_title',
  } = config;

  const { modalVisible, hideModal, showModal } = useModal();

  const titleString =
    (listType ? standardizeString(listType) + ' accounts' : title) +
    (state === 'view' ? ' ' + (index + 1) : '');

  return (
    <View f={1} scrollView={false} keyboardAvoiding>
      {(!noBack || (state === 'list' && configs?.verify) || titleString) &&
        (page ? (
          <HeaderBackButton
            handleBack={handleBack ?? (() => navigation.goBack())}
          />
        ) : (
          <View
            jC="space-between"
            fD="row"
            aI="center"
            mb={description && !hideDescription ? 0 : 0.75}>
            <View w={24}>
              {!noBack && (
                <IconButton
                  icon="back"
                  contained={false}
                  color="#222222"
                  size={22}
                  padded={false}
                  onPress={handleBack ?? (() => navigation.goBack())}
                />
              )}
            </View>
            {Boolean(titleString) && (
              <Text s={20} fW={'700'} lH={38} tA={'center'} id={titleString} />
            )}
            <View w={24}>
              {state === 'list' && configs?.verify && (
                <IconButton
                  icon="help"
                  contained={false}
                  color="#222222"
                  size={22}
                  padded={false}
                  onPress={showModal}
                />
              )}
            </View>
          </View>
        ))}

      {Boolean(image) && Images && (
        <View mb={1} aI={'center'}>
          <Images name={listType ? listType : image} height={70} width={70} />
        </View>
      )}
      {Boolean(titleString) && page && (
        <View ph={1.5} pv={0.5} pb={!description ? 1 : 0}>
          <Text s={20} fW={'700'} tA={'center'} id={titleString} />
        </View>
      )}
      {Boolean(description) && !hideDescription && (
        <View pv={0.5}>
          <Text s={18} lH={24} tA={'center'} id={description} />
        </View>
      )}

      <View ph={noPadding ? 0 : 1.5} f={1} fG={1}>
        {children}
      </View>

      <PopUpGeneral
        visible={modalVisible}
        // docked
        title={'Help'}
        onDismiss={hideModal}>
        <ProfileHelpModal id={id} />
      </PopUpGeneral>
    </View>
  );
}
