import React, { useState } from 'react';

type SettingsItemProps = {
  label: string;
  value: string | boolean;
  type: 'input' | 'select' | 'toggle' | 'action' | 'textarea';
  options?: string[];
  action?: string;
  isPrimary?: boolean;
  placeholder?: string;
};

export default function SettingsItem({
  label,
  value,
  type,
  options = [],
  action,
  isPrimary = false,
  placeholder = ''
}: SettingsItemProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Future: API call to save the value
    console.log(`Saved ${label}:`, currentValue);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  const handleToggle = () => {
    const newValue = !currentValue;
    setCurrentValue(newValue);
    // Future: API call to save immediately
    console.log(`Toggled ${label}:`, newValue);
  };

  return (
    <div className="settings-item">
      <div className="settings-item-info">
        <div className="settings-item-label">{label}</div>
        
        {/* Input Type */}
        {type === 'input' && !isEditing && (
          <div className="settings-item-value">{currentValue as string}</div>
        )}
        {type === 'input' && isEditing && (
          <input
            type="text"
            className="settings-item-input"
            value={currentValue as string}
            onChange={(e) => setCurrentValue(e.target.value)}
            autoFocus
          />
        )}

        {/* Textarea Type */}
        {type === 'textarea' && !isEditing && (
          <div className="settings-item-value settings-item-value-multiline">
            {currentValue as string}
          </div>
        )}
        {type === 'textarea' && isEditing && (
          <textarea
            className="settings-item-textarea"
            value={currentValue as string}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={placeholder}
            rows={4}
            autoFocus
          />
        )}

        {/* Select Type */}
        {type === 'select' && (
          <select
            className="settings-item-select"
            value={currentValue as string}
            onChange={(e) => {
              setCurrentValue(e.target.value);
              console.log(`Changed ${label}:`, e.target.value);
            }}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {/* Toggle Type */}
        {type === 'toggle' && (
          <div className="settings-item-value">
            {currentValue ? 'Enabled' : 'Disabled'}
          </div>
        )}

        {/* Action Type */}
        {type === 'action' && (
          <div className="settings-item-value">{currentValue as string}</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="settings-item-actions">
        {(type === 'input' || type === 'textarea') && !isEditing && (
          <button
            className="settings-item-action"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
        
        {(type === 'input' || type === 'textarea') && isEditing && (
          <>
            <button
              className="settings-item-action"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="settings-item-action settings-item-action-primary"
              onClick={handleSave}
            >
              Save
            </button>
          </>
        )}

        {type === 'toggle' && (
          <button
            className={`settings-toggle ${currentValue ? 'active' : ''}`}
            onClick={handleToggle}
            aria-label={`Toggle ${label}`}
          >
            <span className="settings-toggle-thumb"></span>
          </button>
        )}

        {type === 'action' && action && (
          <button
            className={`settings-item-action ${isPrimary ? 'settings-item-action-primary' : ''}`}
            onClick={() => console.log(`Action: ${action}`)}
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}

