import React, { Component } from 'react';
import { OrderListItem } from './OrderListItem';
import { EmptyListMessage, View, Spinner } from 'components';
import { getOrderItems } from 'utility/rehive';

class OrderItemList extends Component {
  state = {
    loading: true,
    data: [],
  };

  componentDidMount() {
    const { orderId } = this.props;
    this.getOrderItems(orderId);
  }

  async getOrderItems(orderId) {
    const response = await getOrderItems(orderId);
    this.setState({ data: response.data.results, loading: false });
  }

  renderEmptyList() {
    const { loading } = this.props;
    if (!loading) {
      return <EmptyListMessage text="No order items" />;
    }
    return;
  }

  renderItem = (item, currency) => {
    const { profile } = this.props;
    return (
      <OrderListItem
        profile={profile}
        noEdit
        key={item.id}
        item={item}
        currency={currency}
      />
    );
  };

  render() {
    const { data, loading } = this.state;
    const { currency } = this.props;

    return (
      <View p={0.5} bR={10} bC={'grey1'}>
        {loading ? (
          <Spinner />
        ) : data.length > 0 ? (
          data.map(item => this.renderItem(item, currency))
        ) : (
          this.renderEmptyList()
        )}
      </View>
    );
  }
}

export default OrderItemList;
