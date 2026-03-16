import React from "react";

interface LogoutModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <span>Are you sure<br /> you want to log out?</span>
            <p>This will end your current session.</p>
            <div className="modal-actions">
                <button onClick={onConfirm} className="button-confirm">Yes, Log Out</button>
                <button onClick={onCancel} className="button-cancel">Cancel</button>
            </div>
        </div>
        </div>
    );
};

export default LogoutModal;