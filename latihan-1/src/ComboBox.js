import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ComboBox.css';

const ComboBox = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);
  const [searchBoxValue, setSearchBoxValue] = useState('');
  const dropdownRef = useRef(null);

  // Toggle the dropdown open/close
  const toggleDropdown = () => setIsOpen(prev => !prev);

  // Handle input value change
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    filterOptions(value);
  };

  // Handle search box value change
  const handleSearchBoxChange = (event) => {
    const value = event.target.value;
    setSearchBoxValue(value);
    filterOptions(value);
  };

  // Filter options based on search term
  const filterOptions = useCallback((searchTerm) => {
    setFilteredOptions(
      options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!isMultiMode || !selectedOptions.includes(option)) // Exclude selected options
      )
    );
  }, [options, isMultiMode, selectedOptions]);

  // Handle option click
  const handleOptionClick = (option) => {
    if (!isMultiMode) {
      setInputValue(option);
      setIsOpen(false);
      onChange?.(option);
    } else {
      if (!selectedOptions.includes(option)) {
        const newSelection = [...selectedOptions, option];
        setSelectedOptions(newSelection);
        onChange?.(newSelection);
      } else {
        const newSelection = selectedOptions.filter(item => item !== option);
        setSelectedOptions(newSelection);
        onChange?.(newSelection);
      }
    }
  };

  // Handle tag removal
  const handleTagRemove = (option) => {
    const newSelection = selectedOptions.filter(item => item !== option);
    setSelectedOptions(newSelection);
    onChange?.(newSelection);
  };

  // Handle click outside to close dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Toggle single/multi-choice mode
  const toggleMode = () => {
    setIsMultiMode(prev => !prev);
    setSelectedOptions([]);
    setInputValue('');
    setFilteredOptions(options);
  };

  // Toggle search box visibility
  const toggleSearchBox = () => {
    setSearchBoxVisible(prev => !prev);
    setSearchBoxValue('');
    filterOptions('');
  };

  // Highlight matching text in search results
  const highlightMatch = (text) => {
    const regex = new RegExp(`(${searchBoxValue})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <span key={index} className="highlight">{part}</span> : part
    );
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="combobox" ref={dropdownRef}>
      <div className="mode-toggle">
        <span className="mode-label">{isMultiMode ? 'Multi-Choice' : 'Single-Choice'}</span>
        <label className="switch">
          <input type="checkbox" checked={isMultiMode} onChange={toggleMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="search-toggle">
        <span className="search-label">{searchBoxVisible ? 'Search On' : 'Search Off'}</span>
        <label className="switch">
          <input type="checkbox" checked={searchBoxVisible} onChange={toggleSearchBox} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="combobox-input-wrapper">
        {isMultiMode && (
          <div className="selected-tags">
            {selectedOptions.map(option => (
              <div key={option} className="tag" role="option" aria-selected={true}>
                <span className="tag-text">{option}</span>
                <button className="delete-button" onClick={() => handleTagRemove(option)}>&times;</button>
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={toggleDropdown}
          placeholder={isMultiMode ? 'Select or type...' : 'Select...'}
          onFocus={toggleDropdown}
        />
      </div>
      {isOpen && (
        <div className="combobox-dropdown">
          {searchBoxVisible && (
            <input
              type="text"
              value={searchBoxValue}
              onChange={handleSearchBoxChange}
              placeholder="Search..."
              className="search-box"
            />
          )}
          <ul>
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => (
                <li key={index} onClick={() => handleOptionClick(option)}>
                  {highlightMatch(option)}
                </li>
              ))
            ) : (
              <li>No options available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

ComboBox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};

export default ComboBox;