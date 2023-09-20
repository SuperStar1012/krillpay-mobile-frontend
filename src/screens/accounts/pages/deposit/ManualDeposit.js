import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ListItem } from 'components';
import SplitFlowLayout from 'components/layout/SplitFlowLayout';
import {
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
 
import { useToast } from 'contexts/ToastContext';
import { useRehiveContext } from 'contexts/RehiveContext';
import { concatAddress } from 'utility/general';
import { getBankAccounts, fetchItem, createDynamicAccount, createBankAccount } from 'utility/rehive';
import DetailList from 'components/outputs/DetailList';
import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { userProfileSelector } from '@redux/rehive/reducer';

export default function ManualDeposit(props) {
  const [bankAccount, setBankAccount] = useState([]);

  async function printAccount() {
    const bankAccounts = await getBankAccounts();
    setBankAccount(bankAccounts);
  }
  useEffect(() => {
    printAccount();
  }, [1]);

  const { navigation, context } = props;
  const { wallet, companyBankAccounts } = context;
  const [index, setIndex] = useState(0);
  // const accounts = companyBankAccounts?.items?.filter(
  //   acc =>
  //     acc.currencies.findIndex(curr => curr.code === wallet.currency.code) !==
  //     -1,
  // );
  const accounts = bankAccount?.filter(
    acc =>
      acc.currencies.findIndex(curr => curr.code === wallet.currency.code) !==
      -1,
  );

  const bankAcc = accounts?.[index] ?? accounts?.[0];

  const buttons = [
    { id: 'ive_made_the_deposit', onPress: () => navigation.goBack() },
  ];
  
  // TODO: handle no bank acc

  return (
    <View f={1}>
      <SplitFlowLayout
        walletAccount={wallet?.currency?.code}
        contentHeader={
          <DepositHeader
            reference={wallet?.account}
            walletAccount={wallet?.currency?.code}
          />
        }
        contentDetail={
          <DepositDetail
            account={bankAcc}
            walletAccount={wallet?.currency?.code}
          />
        }
        buttons={buttons}
      />
    </View>
  );
}

function DepositHeader(props) {
  const { reference, walletAccount } = props;
  const { showToast } = useToast();

  function handleCopy() {
    Clipboard.setString(reference);
    typeof showToast === 'function' &&
      showToast({
        text: 'Reference copied to clipboard\n' + reference,
        variant: 'success',
      });
  }
  return (
    <Pressable onPress={handleCopy}>
      {walletAccount == 'USD' ? (
        <>
          <Text c="white" p={0.25} s={18} tA="center" fW="700">
            Deposit via Plaid
          </Text>
        </>
      ) : (
        <>
          {/* @AFeez add your header content here for Nigeria accunt */}
          <Text c="white" p={0.25} s={18} tA="center" id="deposit_header" />
          <Text c="white" s={36} p={0.5} tA="center" fW="700">
            {reference}
          </Text>
          <Text c="white" s={12} tA="center" id="tap_to_copy" />

          {/* @AFeez add your header content here for Nigeria accunt  ends*/}
        </>
      )}
    </Pressable>
  );
}

function DepositDetail(props) {
  const { account = {}, walletAccount } = props;

  const {
    bank_name,
    bank_code,
    name,
    number,
    type,
    branch_code,
    swift,
    iban,
    bic,
    branch_address = {},
    routing_number,
  } = account;
  const {
    config: { settingsConfig },
  } = useRehiveContext();
  const { bank = {}, legal = {}, locales } = settingsConfig;
  const { hideFields: hideBankFields = [] } = bank;
  const address = concatAddress(branch_address);
  const [plaidBankAccount, setPlaidBankAccount] = useState([]);
  const refRBSheet = useRef();
  const [selectPlaidItem, setSelectedPlaidItem] = useState();
  const [dwollaOauth, setDwollaOauth] = useState('');
  const [amount, setAmount] = useState(0);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const profile = useSelector(userProfileSelector);
  const user = profile?.data?.[0];
  const dwolla_plaid_integration_service =
    'https://dwolla.krillpay.com/dwolla/fund-balance';

  // let bankFields = [
  //   'name',
  //   'bank_name',
  //   'type',
  //   'number',
  //   'bank_code',
  //   'branch_code',
  //   'bic',
  //   'swift',
  //   'iban',
  //   'routing_number',
  //   'branch_address',
  // ];

  const [items, setItems] = useState([]);

  // let items = [
  //   {
  //     id: 'name',
  //     label: 'account_name',
  //     value: name,
  //     copy: true,
  //   },
  //   { label: 'bank_name', value: bank_name, copy: true },
  //   {
  //     id: 'number',
  //     label: 'account_number',
  //     value: number,
  //     copy: true,
  //   },
  //   { id: 'type', label: 'account_type', value: type, copy: true },
  //   { label: 'branch_code', value: branch_code },
  //   { label: 'bank_code', value: bank_code, copy: true },
  //   { label: 'swift', value: swift },
  //   { label: 'routing_number', value: routing_number },
  //   { label: 'iban', value: iban },
  //   { label: 'bic', value: bic },
  //   { label: 'branch_address', value: address },
  // ]
  //   .filter(
  //     item =>
  //       !hideBankFields.includes(item?.id) &&
  //       !hideBankFields.includes(item?.label),
  //   )
  //   .filter(item => item.value);

     
  /* TODO:
    1. add multi bank acc selector
    2. supported currencies
    3. output labels
    4. output text size
    5. capitalise
    5. output list spacing
    */

  useEffect(() => {
    //for US only
    getPlaidAccounts();
  }, [1]);

  useEffect(() => {
   processVirtuals(items);
  }, [items]);

  const processVirtuals = async (items) => {
    // console.log(`items.length === ${items.length }`)
    if(items.length > 0){
      }
     else{
 
       //user doesn't have a virtual account. Create afresh
      await CreateProvidusAccountNumber();
      await getPlaidAccounts();
     }
  }

  const getPlaidAccounts = async () => {
    const bankAccounts = await getBankAccounts();
    console.log(`bankAccounts === ${JSON.stringify(bankAccounts)}`);
    const bankDetail = bankAccounts?.filter(el => {
      return el.bank_name.toLowerCase().indexOf('providus') !== -1;
    });
    setItems(bankDetail);
    // setPlaidBankAccount(accounts_plaid);
  };

  const processDwollaSandbox = plaidItem => {
    console.log(`plaidItem=== ${JSON.stringify(plaidItem)}`);
    setLoading(true);
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let raw = JSON.stringify({
      email: user?.email,
      access_token: plaidItem?.branch_address.line_1,
      account_id: plaidItem?.branch_address.line_2,
      amount: amount,
      user: user,
    });

    console.log(`processDwollaSandbox=== ${JSON.stringify(raw)}`);
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    fetch(dwolla_plaid_integration_service, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        if (JSON.parse(result).status == 'success') {
          setLoading(false);
          //onSuccess
          showToast({
            text: 'Account Funding successful',
            variant: 'success',
          });
          refRBSheet.current.close();
        }
      })
      .catch(error => {
        setLoading(false);
        refRBSheet.current.close();
      });
  };


  //user account deposit 
  async function CreateProvidusAccountNumber() {

    try{
    const name = user?.first_name
      ? user?.first_name + ' ' + user?.last_name
      : '';
    let dataBankapi = {
      account_name: name,
    };
    const CreateProvidusAccount = await createDynamicAccount(dataBankapi);
    // console.log(await CreateProvidusAccount.data, 'tesr');
     let dataBank = {
      name: CreateProvidusAccount?.data?.account_name,
      number: CreateProvidusAccount?.data?.account_number,
      type: user.groups[0].name,
      currencies: 'NGN',
      beneficiary_type: user.groups[0].name,
      clabe: 'string',
      owner: {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.mobile,
        email_address: user?.email,
        company_name: 'string',
        ein_tin: 'string',
        address: {
          line_1: 'string',
          line_2: 'string',
          city: 'string',
          state_province: 'string',
          country: 'AF',
          postal_code: 'string',
          state_code: 'string',
        },
        cpf_cpnj: 'string',
      },
      bank_name: 'providus bank',
      bank_code: '',
      branch_code: '',
      branch_address: {
        line_1: '',
        line_2: '',
        city: '',
        state_province: '',
        country: 'Nigeria',
        postal_code: '',
        state_code: '',
      },
      routing_number: '',
      swift: '',
      iban: '',
      bic: '',
      metadata: {},
      action: 'withdraw',
    //!   Change action to deposit
    };
    
    const final = await createBankAccount(dataBank);
    console.log(final);
  }
  catch(e){
    console.log(`Bank Account error === ${e}`)
  }
  }
  return (
    <View>
      {/* <View pt={1}>
        {walletAccount == 'USD' ? (
          <>
            <Text tA="center" fW="700" id="plaid_select_bank" />
            {plaidBankAccount?.map((item, index) => {
              return (
                <View key={index}>
                  <ListItem
                    noImage
                    noTitle
                    onPress={() => {
                      setSelectedPlaidItem(item);
                      refRBSheet.current.open();
                    }}
                    disabled={false}>
                    <View
                      f={1}
                      pv={0.5}
                      style={{
                        marginTop: '5%',
                        paddingTop: 10,
                        borderColor: '#f5f5f5',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 5,
                      }}>
                      <View fD="row" w={'100%'} jC={'space-between'}>
                        <Text fW="500">{item.name}</Text>
                      </View>
                      <View style={{ marginRight: 4 }}>
                        <View w={'100%'} fD={'row'}>
                          <Text t={'s2'}>{item.number}</Text>
                          <View f={1}>
                            <Text t={'s2'} tA={'right'}>
                              {item.type}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ListItem>
                </View>
              );
            })}
          </>
        ) : (
          <>
            <Text tA="center" fW="700" id="make_you_deposit" />
            <Text tA="center" s={14} id="bank_deposit_helper" /> 
          </>
        )}
      </View> */}
      <View mt={2}>
        {/* <DetailList {...{ items, locales }} />  move the*/}
        <View style={styles.flexDirectionStyle}>
          <Text>ACCOUNT NAME: </Text>
          <Text>{items[0]?.name}</Text>
        </View>
        <View style={styles.flexDirectionStyle}>
          <Text>BANK NAME: </Text>
          <Text>Providus Bank</Text>
        </View>
        <View style={styles.flexDirectionStyle}>
          <Text>ACCOUNT NUMBER: </Text>
          <Text>{items[0]?.number}</Text>
        </View>
        <View style={styles.flexDirectionStyle}>
          <Text>ACCOUNT TYPE: </Text>
          <Text>INDIVIDUAL</Text>
        </View>
        <View style={styles.flexDirectionStyle}>
          <Text>ACCOUNT LOCATION: </Text>
          <Text>Nigeria</Text>
        </View>
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            backgroundColor: '#f5f5f5',
            borderRadius: 45,
          },
        }}>
        <Text
          style={{
            borderColor: 'gray',
            width: '80%',
            alignSelf: 'center',
            borderWidth: 0,
            borderRadius: 10,
            padding: 10,
            fontWeight: 'bold',
          }}>
          Enter Amount to Deposit($)
        </Text>
        <TextInput
          style={{
            borderColor: 'gray',
            width: '80%',
            alignSelf: 'center',
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
          label=""
          multiline={false}
          //tintColor={colors.primary}
          // style={styles.input}
          placeholder="Enter Amount to deposit ($)"
          //onBlur={onBlur}
          onChangeText={value => {
            setAmount(value);
          }}
          //value={value}
        />
        <TouchableOpacity
          style={{
            borderColor: 'gray',
            width: '80%',
            backgroundColor: 'black',
            alignSelf: 'center',
            borderWidth: 0,
            borderRadius: 10,
            marginTop: '5%',
            padding: 10,
          }}
          onPress={() => {
            processDwollaSandbox(selectPlaidItem); //this will be refactored to the server for production...
            // this is a quick work to see the sandbox flows fine.
          }}>
          {!loading && (
            <Text style={{ color: '#fff', textAlign: 'center' }}>Proceed</Text>
          )}
          {loading && <ActivityIndicator size={'large'} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            refRBSheet.current.close();
          }}>
          <Text
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              marginTop: '5%',
              textDecorationLine: 'underline',
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </RBSheet>
    </View>
  );
}


const styles = StyleSheet.create({
  flexDirectionStyle: {
    flexDirection: 'row',
    padding: 2,
    margin: 2,
  },

});