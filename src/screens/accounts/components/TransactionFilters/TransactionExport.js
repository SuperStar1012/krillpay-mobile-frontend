import React from 'react';
import { View } from 'components';
import ExportList from './ExportList';
import ExportCreate from './ExportCreate';

/*
TODO:
1. list exports + add new export button
2. export type select + create export
3. download and link to share modal
*/

export default function TransactionExport(props) {
  const { id, onDismiss } = props;
  // const {
  //   context: { user },
  // } = useRehiveContext();

  if (id === 'export_list') return <ExportList {...props} />;

  return <ExportCreate {...props} />;
}
