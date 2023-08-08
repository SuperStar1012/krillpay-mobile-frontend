import React from 'react';
import { useContacts } from 'contexts/ContactsContext';
import { userLabel, contactMatch } from '../../util/requests';
import { View } from 'components';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import Pay from '../../components/Pay';
// import { decodeQR } from 'utility/general';

export default function PayPage(props) {
  const { navigation, route } = props;

  const data = route?.params;
  //  decodeQR(
  //   'pay:dd7030f9-ab42-49b3-b9d7-bc3ba6041f19?name=Busi-Business&image=https%253A%252F%252Fstorage.googleapis.com%252Fservice-business-media%252Fbusinesses%252F635%252Ficons%252F2621299b26ed40b0810b25e09a03135b_1632832148.jpeg&type=pos&account=sales&subtype=sale_pos&subtype_debit=purchase_pos',
  // );

  const { context: contacts } = useContacts();

  return (
    <View screen>
      <CompanyStatusBanner />
      <Pay
        {...{
          navigation,
          data,
          contactMatch: props => contactMatch({ ...props, contacts }),
          userLabel,
        }}
      />
    </View>
  );
}
