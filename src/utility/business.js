export function checkBusinessGroup(businessServiceSettings, userGroup) {
  return (
    businessServiceSettings?.items?.manager_groups ??
    businessServiceSettings?.manager_groups ??
    []
  ).includes(userGroup);
}
