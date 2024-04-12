import React from 'react';

interface ActionButtonGroupProps {
    onEdit: () => void;
    onDelete: () => void;
    onAdd: () => void;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({ onEdit, onDelete, onAdd }) => {
    return (
        <div className="flex justify-end gap-2">
            <button
                className="btn btn-sm btn-neutral"
                onClick={onAdd}
            >
                Add New Player
            </button>
            <button
                className="btn btn-sm btn-warning"
                onClick={onEdit}
            >
                Edit
            </button>
            <button
                className="btn btn-sm btn-error"
                onClick={onDelete}
            >
                Delete
            </button>
        </div>
    );
};

export default ActionButtonGroup;
