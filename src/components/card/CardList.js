import React, { Component } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';

import { CardListHeader } from './CardListHeader';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import { View } from '../layout/View';
import PaginationListFooter from '../layout/PaginationListFooter';
import EmptyListPlaceholderImage from '../outputs/CustomImage/empty/EmptyListPlaceholderImage';
import { uuidv4 } from 'utility/general';

class CardList extends Component {
  state = {
    modalType: '',
    modalVisible: false,
    detail: false,
    index: 0,
    indexLoading: false,
    error: '',
    showData2: false,
    toScroll: false,
  };

  componentDidMount() {
    const { forceDetail, onRefresh, id } = this.props;
    if (onRefresh) {
      onRefresh();
    } else {
      // this.props.fetchData(this.props.type);
    }
    if (forceDetail) {
      this.showDetail(0);
    }
    // if (id) {
    //   this.setState({ detail: id });
    // }
  }

  showDetail = index => {
    this.setState({ detail: true, index, toScroll: true });
  };

  hideDetail = () => {
    // this.props.navigation.setParams(null);
    this.setState({ detail: false, id: '' });
  };

  hideModal = modalType => {
    this.setState({ modalVisible: false, modalType, modalLoading: false });
  };

  showModal = (modalType, index) => {
    this.setState({
      modalVisible: true,
      index,
      modalType,
      modalLoading: false,
      error: '',
    });
  };

  renderItem = (item, index) => {
    const { detail } = this.state;
    const { noScroll, forceDetail } = this.props;
    const detailObj = {
      visible: detail,
      hideDetail: this.hideDetail,
      showDetail: index => this.showDetail(index),
    };
    if (detail) {
      return (
        <View f={1} screenWidthPadding={0} scrollView={!noScroll}>
          {this.props.renderItem(item, index, detailObj, forceDetail)}
        </View>
      );
    }
    return this.props.renderItem(item, index, detailObj);
  };

  renderEmptyList() {
    const { data, emptyListMessage, type } = this.props;
    if (!data.loading && type) {
      return <EmptyListPlaceholderImage name={type} text={emptyListMessage} />;
    }
    return;
  }

  renderModal() {
    const { modal } = this.props;
    if (modal && modal.visible) {
      return (
        <PopUpGeneral
          visible={modal.visible}
          modalActionOne={modal.actionOne}
          modalActionTwo={modal.actionTwo}
          onDismiss={modal.onDismiss}
          loading={modal.loading}
          errorText={modal.error}
          contentText={modal.contentText}>
          {modal.content}
        </PopUpGeneral>
      );
    }
    return null;
  }

  render() {
    const {
      data,
      keyExtractor,
      onRefresh,
      header,
      getNext,
      horizontal,
      additionalButtonText,
      type,
      noPadding,
      renderHeader,
      numColumns,
      renderHeaderFixed,
      contentContainerStyle = {},
    } = this.props;

    const { index, detail, id, showData2 } = this.state;

    let items = (showData2 ? data?.data.concat(data?.data2) : data?.data) ?? [];

    const item = id ? items.find(item => item.id === id) : items[index];

    return (
      <View f={1} keyboardAvoiding p={noPadding ? 0 : 1}>
        {detail || (id && item) ? (
          this.renderItem(item, index, data)
        ) : (
          <React.Fragment>
            {renderHeaderFixed ? renderHeaderFixed : null}
            {header ? (
              <View pb={1}>
                <CardListHeader header={header} />
              </View>
            ) : null}
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                {
                  paddingHorizontal: horizontal ? 8 : 0,
                },
                !(items && items.length) ? { height: '90%' } : {},
                contentContainerStyle,
              ]}
              horizontal={horizontal}
              onRefresh={onRefresh}
              refreshing={detail ? false : data.loading ? data.loading : false}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={
              //       detail ? false : data.loading ? data.loading : false
              //     }
              //     onRefresh={() => (onRefresh ? onRefresh : null)}
              //     // colors={[colors.primary]} // TODO: move this to a new context component
              //   />
              // }
              keyboardShouldPersistTaps={'handled'}
              data={items}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              keyExtractor={item => {
                const keyExtractorId =
                  (keyExtractor ? keyExtractor(item) : null) ?? uuidv4();
                return keyExtractorId
                  ? keyExtractorId
                  : item.id
                  ? item.id.toString()
                  : '0';
              }}
              numColumns={numColumns}
              ListEmptyComponent={this.renderEmptyList()}
              ListHeaderComponent={renderHeader ? renderHeader : null}
              ListFooterComponent={
                <PaginationListFooter
                  next={data.more && !data.loading}
                  loading={data.nextLoading}
                  getNext={getNext}
                />
              }
            />
          </React.Fragment>
        )}

        {this.renderModal()}
      </View>
    );
  }
}

CardList.defaultProps = {
  onRefresh: () => {},
  horizontal: false,
};

CardList.propTypes = {
  onRefresh: PropTypes.func,
  horizontal: PropTypes.bool,
};

// const CardList = context(_CardList);

export { CardList };

{
  /* <FlatList
  getItemLayout={(data, index) => ({
    length: SCREEN_WIDTH - 32,
    offset: (SCREEN_WIDTH - 32) * index,
    index,
  })}
  horizontal
  pagingEnabled
  ref={this.myRef}
  initialScrollIndex={index}
  snapToAlignment="center"
  // snapToInterval={SCREEN_WIDTH - 32}
  style={{ height: '100%' }}
  refreshControl={
    <RefreshControl
      refreshing={detail ? false : data.loading ? data.loading : false}
      onRefresh={onRefresh}
    />
  }
  keyboardShouldPersistTaps={'handled'}
  data={items}
  renderItem={({ item, index }) => this.renderItem(item, index)}
  keyExtractor={item =>
    keyExtractor ? keyExtractor(item) : item.id ? item.id.toString() : '0'
  }
  ListEmptyComponent={this.renderEmptyList()}
  automaticallyAdjustContentInsets={false}
  removeClippedSubviews={false}
  enableEmptySections={false}
/>; */
}
