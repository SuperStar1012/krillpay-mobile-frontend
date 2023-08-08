import React from 'react';
import { SectionList, View, Dimensions } from 'react-native';
import { SectionListHeader } from '../layout/SectionListHeader';
import { ListSeparator, ListItem } from '../outputs/ListItem';
import { TextField } from './TextField';
import { useTheme } from '../contexts/ThemeContext';
import { Spinner } from '../outputs/Spinner';
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SearchInput = props => {
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

  const tintColor = color
    ? colors[color]
      ? colors[color]
      : color.charAt(0) === '#'
      ? color
      : colors.primary
    : colors.primary;

  return (
    <View>
      <TextField
        key="editor1"
        autoFocus
        containerBackgroundColor={'white'}
        tintColor={tintColor}
        {...inputProps}
        noMargin
      />

      {loading ? (
        <Spinner size="small" />
      ) : (
        sections &&
        sections.length > 0 && (
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
            extraData={sections}
            sections={sections}
            renderItem={({ item, section }) => (
              <ListItem
                key={item.value}
                noImage={noImage}
                containerStyle={
                  selectedValues?.includes(item.id)
                    ? { backgroundColor: colors.grey2 }
                    : {}
                }
                onPress={() =>
                  section.listItemOnPress ? section.listItemOnPress(item) : {}
                }
                title={
                  section.listItemTitle ? section.listItemTitle(item) : item
                }
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
            )}
            renderSectionHeader={({ section }) =>
              noTitle ? null : (
                <SectionListHeader>{section.title}</SectionListHeader>
              )
            }
            keyExtractor={item => (item.id ? item.id.toString() : '')}
            ItemSeparatorComponent={ListSeparator}
            showsVerticalScrollIndicator
          />
        )
      )}
    </View>
  );
};

export default SearchInput;

/*
TODO:
1. Style better / rethink a bit


*/
