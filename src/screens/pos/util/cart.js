export function calculateHasItems(items = []) {
  if (items?.length === 0) return false;

  let hasItems = true;
  items.forEach(item => {
    if (!item?.price || !item?.quantity) hasItems = false;
  });

  return hasItems;
}
