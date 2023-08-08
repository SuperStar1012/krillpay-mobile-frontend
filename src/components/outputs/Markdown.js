import React from 'react';
import { StyleSheet } from 'react-native';
import MarkdownRenderer from 'react-native-markdown-display';
import { useTheme } from 'components/context';

// const styles = theme => ({
//   listItem: {
//     marginTop: theme.spacing(1),
//   },
// });

// const options = {
//   overrides: {
//     h1: {
//       component: Text,
//       props: {
//         gutterBottom: true,
//         variant: 'h5',
//       },
//     },
//     h2: { component: Text, props: { gutterBottom: true, variant: 'h6' } },
//     h3: {
//       component: Text,
//       props: { gutterBottom: true, variant: 'subtitle1' },
//     },
//     h4: {
//       component: Text,
//       props: { gutterBottom: true, variant: 'caption', paragraph: true },
//     },
//     p: { component: Text, props: { paragraph: true } },
//     a: { component: Link },
//     li: {
//       component: withStyles(styles)(({ classes, ...props }) => (
//         <li className={classes.listItem}>
//           <Text component="span" {...props} />
//         </li>
//       )),
//     },
//   },
// };

export default function Markdown(props) {
  const { colors } = useTheme();
  const styles = useStyles({ colors });
  return <MarkdownRenderer style={styles} {...props} />;
}

const useStyles = ({ colors }) =>
  StyleSheet.create({
    body: {
      color: colors?.font ?? '#434343',
    },
    text: {
      fontSize: 16,
      lineHeight: 22,
    },
  });
