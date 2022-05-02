import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import withPendingRequests from '@commercetools-local/utils/with-pending-requests';
import {
  getCompany,
  updateCompany,
  deleteCompany,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
} from '../../api';

export const CompanyDetailsConnector = props => {
  const [company, setCompany] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {
    environment: { apiUrl },
  } = useApplicationContext();

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        const comp = await getCompany({
          url: apiUrl,
          id: props.companyId,
        });
        setCompany(comp);
        setIsLoading(false);
      } catch (error) {
        setCompany(null);
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, [apiUrl, props.companyId]);

  const handleUpdateCompany = companyDraft => {
    props.pendingUpdaterRequests.increment();
    return updateCompany({ url: apiUrl, payload: companyDraft }).then(
      updatedCompnay => {
        props.pendingUpdaterRequests.decrement();
        setCompany(updatedCompnay);
        return updatedCompnay;
      },
      error => {
        props.pendingUpdaterRequests.decrement();
        throw error;
      }
    );
  };

  const handleSetDefaultBillingAddress = addressId => {
    props.pendingUpdaterRequests.increment();
    return setDefaultBillingAddress({
      url: apiUrl,
      id: props.companyId,
      addressId,
    }).then(
      updatedCompnay => {
        props.pendingUpdaterRequests.decrement();
        setCompany(updatedCompnay);
        return updatedCompnay;
      },
      error => {
        props.pendingUpdaterRequests.decrement();
        throw error;
      }
    );
  };
  const handleSetDefaultShippingAddress = addressId => {
    props.pendingUpdaterRequests.increment();
    return setDefaultShippingAddress({
      url: apiUrl,
      id: props.companyId,
      addressId,
    }).then(
      updatedCompnay => {
        props.pendingUpdaterRequests.decrement();
        setCompany(updatedCompnay);
        return updatedCompnay;
      },
      error => {
        props.pendingUpdaterRequests.decrement();
        throw error;
      }
    );
  };

  const handleDeleteCompany = () => {
    props.pendingDeleterRequests.increment();

    return deleteCompany({ url: apiUrl, id: props.companyId }).then(
      deletedCompany => {
        props.pendingDeleterRequests.decrement();
        return deletedCompany;
      },
      error => {
        props.pendingUpdaterRequests.decrement();
        throw error;
      }
    );
  };

  return props.children({
    companyFetcher: {
      isLoading,
      company,
    },
    companyDeleter: {
      isLoading: false,
      execute: handleDeleteCompany,
    },
    companyUpdater: {
      isLoading: false,
      execute: handleUpdateCompany,
    },
    companyDefaultBillingUpdater: {
      execute: handleSetDefaultBillingAddress,
    },
    companyDefaultShippingUpdater: {
      execute: handleSetDefaultShippingAddress,
    },
  });
};
CompanyDetailsConnector.displayName = 'CompanyDetailsConnector';
CompanyDetailsConnector.propTypes = {
  children: PropTypes.func.isRequired,
  projectKey: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  // HoC
  pendingDeleterRequests: PropTypes.shape({
    increment: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  pendingUpdaterRequests: PropTypes.shape({
    increment: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default flowRight(
  withPendingRequests('pendingDeleterRequests'),
  withPendingRequests('pendingUpdaterRequests')
)(CompanyDetailsConnector);
