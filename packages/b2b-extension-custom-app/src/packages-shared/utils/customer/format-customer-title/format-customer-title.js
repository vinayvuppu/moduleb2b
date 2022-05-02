export default function formatCustomerTitle({ title, salutation }) {
  if (title) return title.trim();
  if (salutation) return salutation.trim();
  return '';
}
