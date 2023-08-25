import React from 'react';
import { View } from 'components/layout/View';
import { Text } from 'components';
import Images from '../images';
import IconButton from 'components/inputs/IconButton';
import { useModal } from 'utility/hooks';
import { PopUpGeneral } from './PopUpGeneral';
import { standardizeString } from 'utility/general';
import ProfileHelpModal from './ProfileHelpModal';
import Header from './HeaderNew';
import { useNavigation } from '@react-navigation/native';
import { useKeyboard } from 'hooks/keyboard';
import { useTranslation } from 'react-i18next';

export default function FormLayout(props) {
  let {
    config = {},
    children,
    onBack,
    handleBack = onBack,
    state,
    index,
    configs,
    listType,
    noPadding,
    noBack,
    scrollView: scrollViewProps = true,
    id,
    headerProps,
    footer,
    header,
    contentViewProps,
  } = props;
  const navigation = useNavigation();
  const {
    image,
    description,
    title = id + '_title',
    scrollView = scrollViewProps,
  } = config;
  if (!contentViewProps && !scrollView) contentViewProps = { f: 1 };

  const { modalVisible, hideModal, showModal } = useModal();

  const { t } = useTranslation('common');
  const titleString = listType
    ? standardizeString(listType) + ' ' + t('accounts_list_suffix')
    : title;

  const { keyboardHeight } = useKeyboard();

  return (
    <React.Fragment>
      <View f={1} scrollView={scrollView} keyboardAvoiding>
        {(!noBack || (state === 'list' && configs?.verify)) && (
          <Header
            handleBack={handleBack ?? (() => navigation.goBack())}
            rightAction={
              state === 'list' &&
              configs?.verify && (
                <View style={{ paddingTop: 12 }} pr={1.5}>
                  <IconButton
                    icon="help"
                    contained={false}
                    color="#222222"
                    size={22}
                    padded={false}
                    onPress={showModal}
                  />
                </View>
              )
            }
            {...headerProps}
          />
        )}
        {header
          ? header
          : Boolean(image) &&
            Images && (
              <View mb={1} aI={'center'}>
                <Images
                  name={listType ? listType : image}
                  height={70}
                  width={70}
                />
              </View>
            )}
        {Boolean(titleString || description) && (
          <View mb={1} ph={1.5}>
            {Boolean(titleString) && (
              <Text tA={'center'}>
                <Text
                  s={20}
                  fW={'700'}
                  lH={38}
                  tA={'center'}
                  id={titleString}
                />
                <Text s={20} fW={'700'} lH={38} tA={'center'}>
                  {state === 'view' ? ' ' + (index + 1) : ''}
                </Text>
              </Text>
            )}
            {Boolean(description) && (
              <Text
                p={0.5}
                s={16}
                c="#868686"
                lH={28}
                tA={'center'}
                id={description}
              />
            )}
          </View>
        )}

        <View ph={noPadding ? 0 : 1.5} {...contentViewProps}>
          {children}
        </View>
        {footer ? <View h={180} /> : null}
      </View>

      {footer && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            bottom: 0 + keyboardHeight,
            left: 0,
            width: '100%',
          }}>
          {footer}
        </View>
      )}
      <PopUpGeneral visible={modalVisible} title={'help'} onDismiss={hideModal}>
        <ProfileHelpModal id={id} />
      </PopUpGeneral>
    </React.Fragment>
  );
}
