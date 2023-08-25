export const ProductFilterConfig = {
  type: {
    label: 'Type',
    type: 'select',
    options: [
      { value: 'virtual', label: 'Virtual' },
      { value: 'physical', label: 'Physical' },
    ],
  },
  category: {
    label: 'Category',
    type: 'category',
    options: { levels: 3 },
  },
  countries: {
    label: 'Country',
    type: 'country',
  },
};
