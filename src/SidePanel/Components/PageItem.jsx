import React, { useState } from 'react';
import { FileIcon } from '../../Icons/FileIcon';

export const PageItem = ({ page, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="file-item" 
            onClick={() => onClick(page)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div className='file-icon'>
                <FileIcon />
            </div>
            <div className={`file-item-title ${isHovered ? 'label-emphasised' : 'label'}`} >
                {page.title}
            </div>
        </div>
    );
};
