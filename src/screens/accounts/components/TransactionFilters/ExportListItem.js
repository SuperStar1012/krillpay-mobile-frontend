import React from 'react';
import { getExport } from 'utility/rehive';
import moment from 'moment';
import IconButton from 'components/inputs/IconButton';
import { View, Spinner } from 'components';
import Output from 'components/outputs/OutputNew';
import { useQuery } from 'react-query';
import { Share } from 'react-native';

export default function ExportListItem(props) {
  const { item } = props;
  const { id, progress } = item;

  const { data, isLoading } = useQuery(
    ['transaction-export', id],
    () => getExport(item.id),
    {
      enabled: true,
    },
  );

  const url = data?.pages?.[0]?.file;

  async function handleShare() {
    try {
      await Share.share({
        message: 'Download export: ' + url,
        url,
      });
    } catch (error) {
      // alert(error.message);
    }
  }

  // async function handleDownload() {
  //   setDownloading(true);
  //   // WebBrowser.openBrowserAsync(url);
  //   const resp = await FileSystem.downloadAsync(
  //     url,
  //     FileSystem.documentDirectory + filename,
  //   );
  //   if (resp?.status === 200) showToast({ id: 'export_download_success' });
  //   else showToast({ id: 'export_download_error' });
  //   console.log('handleDownload -> resp', resp);
  //   setDownloading(false);
  // }

  return (
    <View>
      <View fD="row" pr={2} aI="center">
        <Output
          label={moment(item.created).format('YYYY/MM/DD hh:mm:ss')}
          value={item.file_format}
        />

        <View>
          {progress !== 100 || isLoading ? (
            <Spinner size="small" />
          ) : (
            <View fD="row">
              {/* <IconButton
                icon="file-download"
                size={20}
                set="MaterialIcons"
                // disabled={!url}
                onPress={handleDownload}
              /> */}
              <IconButton
                icon="share"
                size={20}
                set="MaterialIcons"
                disabled={!url}
                onPress={handleShare}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
