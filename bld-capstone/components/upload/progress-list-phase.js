import { ImageList } from '@mui/material';
import React from 'react';
import ProgressItemPhase from './progress-item-phase';

const ProgressListPhase = ({ files, projectId, phaseId,version }) => {
  return (
    <ImageList rowHeight={200} cols={4}>
      {files.map((file, index) => (
        <ProgressItemPhase
          file={file} 
          key={index} 
          projectId={projectId}
          phaseId={phaseId}
          version={version}
        />
      ))}
    </ImageList>
  );
};

export default ProgressListPhase;
