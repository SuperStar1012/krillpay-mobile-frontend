import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '@redux/rehive/actions';
import { companyBankAccountsSelector } from '@redux/selectors';
import EmptyListMessage from 'core/common/components/lists/EmptyListMessage';
import Spinner from 'core/common/components/outputs/Spinner';
import { View } from 'core/common/components/layout/View';
import Text from 'core/common/components/outputs/Text';
import AccountReference from 'screens/settings/components/AccountReference';
import CompanyBankAccountsSelector from '../../selectors/CompanyBankAccountSelector';
import OutputList from 'core/common/components/lists/OutputList';

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
  }, [dispatch]);

  useEffect(() => {
    if (!accounts[index]) {
      setIndex(0);
    }
  }, [accounts, index]);

  const bankAcc = accounts[index];
  if (!bankAcc) {
    if (companyBankAccounts.loading) {
      return <Spinner />;
    }
    return (
      <EmptyListMessage>
        No deposit details have been provided to fund this account.
      </EmptyListMessage>
    );
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

  return (
    <View>
      {TextComponent ? (
        TextComponent
      ) : (
        <Text p={0.5} tA={'center'}>
          Fund your account by transferring one of the listed currencies with
          the unique reference number below.
        </Text>
      )}
      <AccountReference>{currency?.account}</AccountReference>

      {accounts.length > 1 && (
        <View pt={0.75} w={'100%'}>
          <CompanyBankAccountsSelector
            data={accounts}
            index={index}
            handleChange={index => setIndex(index)}
          />
        </View>
      )}
      <OutputList items={bankDetails} outputProps={{ copy: true }} pb={2} />
    </View>
  );
};

export default CompanyBankAccountDeposit;
