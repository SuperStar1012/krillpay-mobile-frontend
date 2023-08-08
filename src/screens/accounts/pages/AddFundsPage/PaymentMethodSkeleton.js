import React from 'react';
// import SkeletonContent from 'react-native-skeleton-content';
import { StyleSheet, View } from 'react-native';
import { Text, Spinner } from 'components';

const PaymentMethodSkeleton = props => {
  const { label, children, height = 86 } = props;

  return (
    <View>
      {Boolean(label) && (
        <Text
          style={{
            fontSize: 12,
            color: '#777',
            opacity: 0.7,
            marginBottom: 4,
          }}>
          {label}
        </Text>
      )}
      <View style={[styles.containerViewStyle, { height }]}>
        <Spinner />
      </View>
    </View>
  );
  // return (
  //   <SkeletonContent
  //     containerStyle={styles.container}
  //     isLoading={loading ?? isLoading}
  //     layout={[
  //       { key: 'someId', width: 220, height: 20, marginBottom: 6 },
  //       { key: 'someOtherId', width: 180, height: 20, marginBottom: 6 },
  //     ]}>
  //     <Text style={styles.normalText}>Your content</Text>
  //     <Text style={styles.bigText}>Other content</Text>
  //   </SkeletonContent>
  // );

  // return (
  //   <div className={}>
  //     <Skeleton variant="circle" width={48} height={48} />
  //     <div className={styles.left}>
  //       <Skeleton width={matches ? 60 : 100} height={28} />
  //       {/* <Skeleton width={matches ? 80 : 80} height={14} /> */}
  //     </div>
  //     <div className={styles.right}>
  //       <Skeleton width={matches ? 40 : 60} height={16} />
  //     </div>
  //   </div>
  // );
};

const styles = StyleSheet.create({
  containerViewStyle: {
    borderWidth: 1,
    width: '100%',
    borderColor: 'lightgray',
    borderRadius: 20,
    justifyContent: 'center',
  },
});

export default PaymentMethodSkeleton;
