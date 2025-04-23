import React, { createContext, useContext, useState } from 'react';
import Popup from '../components/common/Popup';

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: null,
  });

  const showPopup = ({ title, message, onConfirm, onCancel }) => {
    setPopup({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setPopup(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: onCancel ? () => {
        onCancel();
        setPopup(prev => ({ ...prev, isOpen: false }));
      } : null,
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <PopupContext.Provider value={{ showPopup, closePopup }}>
      {children}
      <Popup {...popup} onClose={closePopup} />
    </PopupContext.Provider>
  );
};
