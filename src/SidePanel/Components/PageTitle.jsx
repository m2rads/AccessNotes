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
    const newTitle = evt.target.value.replace(/<\/?[^>]+(>|$)/g, "");
    setTitle(newTitle);
    setIsEmpty(newTitle.trim() === '');
    onTitleChange(newTitle.trim() || 'Untitled');
  };

  const handleBlur = () => {
    if (title.trim() === '') {
      setIsEmpty(true);
      onTitleChange('Untitled');
    }
  };

  return (
    <div className="title-container" style={{ display: 'flex', alignItems: 'center' }}>
      <ContentEditable
        innerRef={titleRef}
        html={isEmpty ? '' : title}
        disabled={false}
        onChange={handleChange}
        onBlur={handleBlur}
        tagName='h1'
        style={{
          outline: 'none',
          color: isEmpty ? '#6B7280' : '#000000',
          fontSize: '24px',
          fontWeight: 'bold',
          marginRight: '10px',
          padding: '5px',
          borderRadius: '4px',
          minWidth: '100px',
        }}
      />
      {isEmpty && (
        <span 
          style={{
            position: 'absolute',
            color: '#6B7280',
            marginLeft: "4px",
            fontSize: '24px',
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}
        >
          Untitled
        </span>
      )}
      <a className="styled-link" href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#6B7280' }}>
        {url}
      </a>
    </div>
  );
};