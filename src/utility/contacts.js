import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import { safe } from './general';

const PAGE_SIZE = 500;

var ContactUtil = {
  getAllContacts: async (types = []) => {
    const permission = await Permissions.askAsync(Permissions.CONTACTS);

    try {
      if (permission.status === 'granted') {
        let response = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Emails,
            Contacts.Fields.Image,
          ],
          pageSize: PAGE_SIZE,
          pageOffset: 0,
        });

        let contacts = response.data;

        for (i = 1; i < response.total / PAGE_SIZE; i++) {
          response = await Contacts.getContactsAsync({
            fields: [
              Contacts.Fields.PhoneNumbers,
              Contacts.Fields.Emails,
              Contacts.Fields.Image,
            ],
            pageSize: PAGE_SIZE,
            pageOffset: PAGE_SIZE * i,
          });
          contacts = contacts.concat(response.data);
        }

        var data = [];
        var alreadyAdded = [];
        let count = 0;
        contacts.forEach(node => {
          if (
            typeof node.phoneNumbers !== 'undefined' &&
            types.includes('mobile')
          ) {
            node.phoneNumbers.forEach(number => {
              var mobile = safe(number, 'number');
              mobile = mobile.replace(/\s/g, '');
              if (alreadyAdded.indexOf(mobile) == -1) {
                var newData = {
                  name: safe(node, 'name'),
                  type: 'mobile',
                  contact: mobile,
                  image: node.imageAvailable ? node.image.uri : '',
                  id: count,
                };
                data.push(newData);
                alreadyAdded.push(mobile);
                count++;
              }
            });
          }
          if (typeof node.emails !== 'undefined' && types.includes('email')) {
            node.emails.forEach(email => {
              var address = safe(email, 'email');
              if (alreadyAdded.indexOf(address) == -1) {
                var newData = {
                  name: safe(node, 'name'),
                  type: 'email',
                  contact: address,
                  image: node.imageAvailable ? node.image.uri : '',
                  id: count,
                };
                data.push(newData);
                alreadyAdded.push(address);
                count++;
              }
            });
          }
        });

        data = data.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        });

        return data;
      }
    } catch (e) {
      console.log(e);
    }

    return [];
  },
};

export default ContactUtil;
