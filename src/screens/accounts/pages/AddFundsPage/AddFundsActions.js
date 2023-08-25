import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import moment from 'moment';

import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import ActionList from 'core/common/components/lists/ActionList';
import { formatDivisibility } from 'core/common/util/general';
import Text from 'core/common/components/outputs/Text';
import { Button } from 'core/common/components/inputs/Button';
import { getIndacoinTransactions } from 'utility/rehive';
import { get } from 'lodash';

export default function AddFundsActions(props) {
  const { formikProps } = props;
  const [indacoinTransactions, setIndacoinTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const paymentMethod = get(formikProps, ['values', 'paymentMethod']);

  useEffect(() => {
    let timer = null;
    async function fetchIndacoinTransactions() {
      const resp = await getIndacoinTransactions('status=Pending');

      if (resp.status === 'success') {
        setIndacoinTransactions(get(resp, ['data', 'results']));
      }

      timer = setTimeout(() => {
        fetchIndacoinTransactions();
      }, 5000);
    }

    if (paymentMethod === 'indacoin') {
      fetchIndacoinTransactions();
    }
    return () => clearTimeout(timer);
  }, [paymentMethod]);

  const showPending =
    paymentMethod === 'indacoin' && indacoinTransactions.length > 0;

  if (showPending) {
    return (
      <ActionList
        setOpen={setOpen}
        open={open}
        actions={[
          {
            id: 'filters',
            tooltip: 'Pending',
            icon: <HourglassEmptyIcon />,
            content: (
              <PendingIndacionTransactions items={indacoinTransactions} />
            ),
          },
        ]}
      />
    );
  }
  return null;
}

function PendingIndacionTransactions(props) {
  const { items } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.pendingList}>
      <Text bold>Pending transactions</Text>
      {items.map(item => (
        <Button
          key={item.id}
          href={item.link}
          variant="text"
          wide
          newTab
          noPadding>
          <div className={classes.pendingListItem}>
            <div className={classes.pendingListItemName}>
              <Text>{'ID: ' + item.id}</Text>
              <Text className={classes.pendingListItemDate} variant="subtitle2">
                {'Last updated: ' + moment(item.updated).fromNow()}
              </Text>
            </div>
            <Text
              bold
              variant="h6"
              align="right"
              width="auto"
              // style={{ whiteSpace: 'nowrap' }}  // whiteSpace does not support by Text
            >
              {formatDivisibility(item.amount_in, 2) + ' EUR'}
            </Text>
          </div>
        </Button>
      ))}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  selector: {
    width: '100%',
    display: 'flex',
    // padding
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));
