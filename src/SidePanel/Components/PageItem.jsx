import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FileIcon } from '../../Icons/FileIcon';

export const PageItem = ({ page, onClick, onDrop, isCircularReference, subpages, allPages }) => {
    const [isHovered, setIsHovered] = useState(false);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'PAGE',
        item: { id: page.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'PAGE',
        canDrop: (item) => !isCircularReference(item.id, page.id) && item.id !== page.id,
        drop: (item) => {
            onDrop(item.id, page.id);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    const isActive = isOver && canDrop;

    return (
        <div ref={drop}>
            <div 
                ref={drag}
                className={`file-item ${isDragging ? 'dragging' : ''} ${isActive ? 'drop-target' : ''}`} 
                onClick={() => onClick(page)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                // style={{ 
                //     opacity: isDragging ? 0.5 : 1,
                //     backgroundColor: isActive ? '#e0e0e0' : 'transparent',
                //     border: isActive ? '2px dashed #999' : '2px solid transparent'
                // }}
            >
                <div className='file-icon'>
                    <FileIcon />
                </div>
                <div className={`file-item-title ${isHovered ? 'label-emphasised' : 'label'}`}>
                    {page.title}
                </div>
            </div>
            {subpages && subpages.length > 0 && (
                <div className="subpages" style={{ marginLeft: '20px' }}>
                    {subpages.map(subpage => (
                        <PageItem 
                            key={subpage.id} 
                            page={subpage} 
                            onClick={onClick}
                            onDrop={onDrop}
                            isCircularReference={isCircularReference}
                            subpages={allPages.filter(p => p.parentId === subpage.id)}
                            allPages={allPages}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};