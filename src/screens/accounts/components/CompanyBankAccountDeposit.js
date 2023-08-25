import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '@redux/actions';

import { Output, View, Text, EmptyListMessage, Spinner } from 'components';
import { companyBankAccountsSelector } from '@redux/rehive/reducer';
import Selector from 'components/inputs/Selector';
import OutputList from 'components/outputs/OutputList';

const CompanyBankAccountDeposit = props => {
  const { currency, TextComponent } = props;
  const companyBankAccounts = useSelector(companyBankAccountsSelector);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  const accounts = companyBankAccounts.items.filter(
    acc =>
      acc.currencies.findIndex(curr => curr.code === currency.currency.code) !==
      -1,
  );

  useEffect(() => {
    dispatch(fetchData('companyBankAccounts'));
  }, []);

  useEffect(() => {
    if (!accounts[index]) {
      setIndex(0);
    }
  }, [accounts, index]);

  const bankAccountItems = accounts.map((item, index) => {
    return {
      label: renderValue(item),
      value: index,
    };
  });

  const bankAcc = accounts[index];
  if (!bankAcc) {
    if (companyBankAccounts.loading) {
      return <Spinner />;
    }
    return <EmptyListMessage>No bank accounts</EmptyListMessage>;
  }

  const {
    name,
    type,
    number,
    bank_name,
    bank_code,
    branch_code,
    swift,
    iban,
    bic,
  } = bankAcc;

  const bankDetails = [
    { label: 'Name', value: name },
    type ? { label: 'Type', value: type } : null,
    number ? { label: 'Number', value: number } : null,
    bank_name ? { label: 'Bank name', value: bank_name } : null,
    bank_code ? { label: 'Bank code', value: bank_code } : null,
    branch_code ? { label: 'Branch code', value: branch_code } : null,
    swift ? { label: 'Switft', value: swift } : null,
    iban ? { label: 'IBAN', value: iban } : null,
    bic ? { label: 'BIC', value: bic } : null,
  ];

  const showSelector = Boolean(bankAccountItems.length > 1);

  return (
    <View p={0.5} scrollView>
      {TextComponent ? (
        TextComponent
      ) : (
        <Text p={0.5} tA={'center'}>
          Fund your account by transferring one of the listed currencies with
          the unique reference number below.
        </Text>
      )}
      <View
        p={0.25}
        bR={10}
        style={{ borderWidth: 1, borderColor: 'lightgray' }}>
        <Output label={'Account reference'} value={currency?.account} copy />
      </View>
      {showSelector && (
        <View ph={0.25}>
          <Selector
            items={bankAccountItems}
            value={index}
            label={'Company bank account'}
            formatValue={renderValue}
            onValueChange={index => setIndex(index)}
          />
        </View>
      )}
      <OutputList
        items={bankDetails}
        outputProps={{ copy: true }}
        pb={2}
        p={0.25}
      />
    </View>
  );
};

export default CompanyBankAccountDeposit;

const renderValue = item => {
  // let item = data[val];
  const { bank_name, name } = item;
  // let currencyString = '';
  // currencyString = currencies.map(curr => ' ' + curr.code);
  return bank_name ? bank_name : name; // + ' (' + currencyString.toString().substring(1) + ')';
};
