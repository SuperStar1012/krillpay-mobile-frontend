import * as Contacts from 'expo-contacts';
// import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { safe } from './general';
import { krillPayContacts } from '../utility/customService';

const PAGE_SIZE = 500;

var ContactUtil = {
  getAllContacts: async (types = [], handleRefresh) => {
    const { status } = await Contacts.requestPermissionsAsync();

    try {
      if (status === 'granted') {
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

        for (let i = 1; i < response.total / PAGE_SIZE; i++) {
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
        const token = await AsyncStorage.getItem('user_token');
        console.log(token);

        const contact_list = await AsyncStorage.getItem('contact_list');

        if (!contact_list || handleRefresh) {
          console.log('call rehive custom service');
          const list = await krillPayContacts(token, data);

          if (Object.keys(list).length == 4) {
            await AsyncStorage.setItem('contact_list', JSON.stringify(list));
            const krillpayList = {
              suggested: list.matchingRegistorUsers,
              contacts: list.unRegistoredUsers,
              krillpayUsers: list.krillPayUsers,
            };

            return krillpayList;
          } else {
            const krillpayList = {
              error: list,
            };
            return krillpayList;
          }
        } else {
          console.log('restoring data from cache');
          const contact_list = await AsyncStorage.getItem('contact_list');
          const list = JSON.parse(contact_list);
          const krillpayList = {
            suggested: list.matchingRegistorUsers,
            contacts: list.unRegistoredUsers,
            krillpayUsers: list.krillPayUsers,
          };
          return krillpayList;
        }
      }
    } catch (e) {
      if (data.length > 0) {
        const krillpayList = {
          suggested: [],
          contacts: data,
          krillpayUsers: [],
        };
        return krillpayList;
      }
    }

    return [];
  },
};

export default ContactUtil;
