import React, { Component } from 'react';

import { CardList } from 'components';
import { ContactCard } from './ContactCard';

class ContactsList extends Component {
  render() {
    const { data, onRefresh, header } = this.props;

    return (
      <CardList
        header={header}
        data={{ data: data.recent }}
        onRefresh={onRefresh}
        renderItem={(item, index, detailObj) => (
          <ContactCard
            {...this.props}
            item={item}
            index={index}
            detailObj={detailObj}
          />
        )}
        horizontal
        emptyListMessage={'No recent contacts'}
      />
    );
  }
}

export default ContactsList;
