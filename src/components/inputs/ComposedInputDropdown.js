import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import context from '../context';
import { SectionList } from 'react-native';
import { View } from '../layout/View';
import { ListItem, ListSeparator } from '../outputs/ListItem';
import { SectionListHeader } from '../layout/SectionListHeader';
import { TextField } from './TextField';

class _ComposedInputDropdown extends Component {
  state = { focused: false };
  componentDidUpdate() {
    const { focused } = this.state;
    try {
      const isFocused = this?.textField ? this?.textField?.isFocused() : false;
      if (focused !== isFocused) this.setState({ focused: isFocused });
    } catch (e) {}
  }

  focus() {
    try {
      this.textField.focus();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { sections, noImage, noTitle } = this.props;
    const { focused } = this.state;

    return (
      <View>
        <TextField
          {...this.props}
          helper={focused ? '' : this.props.helper}
          error={focused ? '' : this.props.error}
          noMargin
          ref={input => {
            this.textField = input;
          }}
        />

        {focused && sections && sections.length > 0 && (
          <View>
            <SectionList
              onStartShouldSetResponder={() => true}
              stickySectionHeadersEnabled
              keyboardShouldPersistTaps="always"
              style={{
                // backgroundColor: colors.grey1,
                maxHeight: 170,
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
              sections={sections}
              renderItem={({ item, section }) => (
                <ListItem
                  key={item.value}
                  noImage={noImage}
                  onPress={() =>
                    section.listItemOnPress ? section.listItemOnPress(item) : {}
                  }
                  title={
                    section.listItemTitle ? section.listItemTitle(item) : item
                  }
                  subtitle={
                    section.listItemSubtitle
                      ? section.listItemSubtitle(item)
                      : ''
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
          </View>
        )}
      </View>
    );
  }
}

const ComposedInputDropdown = context(_ComposedInputDropdown);

export { ComposedInputDropdown };

/*
TODO:
1. Replace all uses with SearchInput
2. Delete

*/
