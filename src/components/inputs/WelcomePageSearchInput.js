import React from 'react';
import { SectionList, View, Dimensions } from 'react-native';
import { SectionListHeader } from '../layout/SectionListHeader';
import { ListSeparator, ListItem } from '../outputs/ListItem';
import { TextField } from './TextField';
import { useTheme } from '../contexts/ThemeContext';
import { Spinner } from '../outputs/Spinner';
import { Button, Text } from 'components';
import { useModal } from 'utility/hooks';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
const SCREEN_HEIGHT = Dimensions.get('window').height;

const WelcomePageSearchInput = props => {
  const {
    sections,
    noImage,
    noTitle,
    color,
    loading,
    selectedValues,
    ...inputProps
  } = props;
  const { colors } = useTheme();
  const { modalVisible, hideModal, showModal } = useModal();

  const tintColor = color
    ? colors[color]
      ? colors[color]
      : color.charAt(0) === '#'
      ? color
      : colors.primary
    : colors.primary;

  const renderListView = (sectionItems, showViewMore = false) => {
    return (
      <SectionList
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="always"
        style={{
          maxHeight: SCREEN_HEIGHT - 200,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          overflow: 'hidden',
          paddingBottom: 4,
        }}
        contentContainerStyle={{
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          overflow: 'hidden',
        }}
        extraData={sectionItems}
        sections={sectionItems}
        scrollEnabled={false}
        renderItem={({ item, section, index }) =>
          showViewMore && index > 2 ? null : (
            <ListItem
              key={item.value}
              noImage={noImage}
              containerStyle={
                selectedValues?.includes(item.id)
                  ? { backgroundColor: colors.grey2 }
                  : {}
              }
              styleImage={{ marginLeft: 0 }}
              onPress={() =>
                section.listItemOnPress ? section.listItemOnPress(item) : {}
              }
              title={section.listItemTitle ? section.listItemTitle(item) : item}
              subtitle={
                section.listItemSubtitle ? section.listItemSubtitle(item) : ''
              }
              image={
                section.listItemIcon
                  ? section.listItemIcon(item)
                  : item.image
                  ? item.image
                  : null
              }
            />
          )
        }
        renderSectionHeader={({ section }) =>
          noTitle ? null : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <SectionListHeader fontSize={14}>
                {section.title}
              </SectionListHeader>
              {showViewMore && (
                <Button>
                  <Text
                    s={14}
                    c="#5D48F8"
                    fW="500"
                    id="view_more"
                    style={{ textDecorationLine: 'underline' }}
                    onPress={showModal}></Text>
                </Button>
              )}
            </View>
          )
        }
        keyExtractor={item => (item.id ? item.id.toString() : '')}
        // ItemSeparatorComponent={ListSeparator}
        showsVerticalScrollIndicator
      />
    );
  };

  return (
    <View>
      <TextField
        key="editor1"
        autoFocus
        containerBackgroundColor={'white'}
        tintColor={tintColor}
        {...inputProps}
        noMargin
        type="plain"
        keyboardType="visible-password"
        autoComplete="off"
      />

      {loading ? (
        <Spinner size="small" />
      ) : (
        sections && sections.length > 0 && renderListView(sections, true)
      )}
      {sections && sections.length > 0 && modalVisible && (
        <PopUpGeneral
          title="Select Wallet"
          titleColor="#000000"
          docked
          visible={modalVisible}
          onDismiss={hideModal}>
          <View>{renderListView(sections)}</View>
        </PopUpGeneral>
      )}
    </View>
  );
};

export default WelcomePageSearchInput;

/*
TODO:
1. Style better / rethink a bit


*/
