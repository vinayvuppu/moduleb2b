const createSelectEmployeeDataFenceData = componentProps => demandedDataFence => {
  switch (demandedDataFence.type) {
    case 'store':
      return (componentProps.employee?.stores ?? []).map(
        employeeStore => employeeStore.key
      );
    default:
      return null;
  }
};
export default createSelectEmployeeDataFenceData;
