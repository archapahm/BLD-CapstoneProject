import { ImageList } from '@mui/material';
import React from 'react';
import ProgressItem from './progress-item';

const ProgressList = ({ files, projectId, version }) => {
  return (
    <ImageList rowHeight={200} cols={4}>
      {files.map((file, index) => (
        <ProgressItem 
          file={file} 
          key={index} 
          projectId={projectId}
          version={version}
        />
      ))}
    </ImageList>
  );
};

export default ProgressList;
