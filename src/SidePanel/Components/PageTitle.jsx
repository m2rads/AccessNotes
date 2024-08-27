import React, { useState, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';

export const PageTitle = ({ url, page, onTitleChange }) => {
  const [title, setTitle] = useState(page.title || '');
  const [isEmpty, setIsEmpty] = useState(!page.title);
  const titleRef = useRef(null);

  useEffect(() => {
    setTitle(page.title || '');
    setIsEmpty(!page.title);
  }, [page.title]);

  const handleChange = (evt) => {
    const newTitle = evt.target.value.replace(/<\/?[^>]+(>|$)/g, "").trim().replace(/&nbsp;/g, ' ');
    setTitle(newTitle);
    setIsEmpty(newTitle === '');
    if (newTitle !== '') {
      onTitleChange(newTitle);
    } else {
      onTitleChange(''); // Pass empty string to parent when title is empty
    }
  };

  const handleBlur = () => {
    if (title.trim() === '') {
      setIsEmpty(true);
      onTitleChange(''); // Pass empty string to parent when title is empty
    }
  };

  return (
    <div className="title-container" style={{ display: 'flex', alignItems: 'center' }}>
      <ContentEditable
        innerRef={titleRef}
        html={title}
        disabled={false}
        onChange={handleChange}
        onBlur={handleBlur}
        tagName='h1'
        className={`title-input ${isEmpty ? 'empty' : ''}`}
      />
      {isEmpty && (
        <span className="title-placeholder">
          Untitled
        </span>
      )}
    </div>
  );
};