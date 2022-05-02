export default function formatCustomerAddress({ streetName, streetNumber }) {
  if (streetName && !streetNumber) return streetName.trim();
  if (streetName && streetNumber) return `${streetName} ${streetNumber}`.trim();

  return '-';
}
