import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ConfirmContext = createContext();

const ConfirmContextProvider = ({ children }) => {
  const [confirm, setConfirm] = useState({
    prompt: '',
    isOpen: false,
    proceed: null,
    cancel: null,
  });

  return (
    <ConfirmContext.Provider value={[confirm, setConfirm]}>
      {children}
    </ConfirmContext.Provider>
  );
};

ConfirmContextProvider.propTypes = { children: PropTypes.element };

export default ConfirmContextProvider;
