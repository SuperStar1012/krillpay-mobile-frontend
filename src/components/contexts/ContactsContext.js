import { useState, useEffect } from 'react';
import ContactUtil from 'utility/contacts';

function useContacts(types) {
  const [contacts, setcontacts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPhoneContacts() {
    setLoading(true);
    try {
      const response = await ContactUtil.getAllContacts(types);
      setcontacts(response);
    } catch (e) {
      //setError
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchPhoneContacts();
  }, []);

  return {
    context: {
      phone: contacts,
      recent: [],
      loading,
    },
    refresh: fetchPhoneContacts,
    fetchPhoneContacts,
  };
}

export { useContacts };
