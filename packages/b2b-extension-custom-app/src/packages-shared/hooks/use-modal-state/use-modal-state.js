import React from 'react';

const useModalState = (initialState = false) => {
  const [isModalOpen, setIsModalOpen] = React.useState(initialState);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};

export default useModalState;
