import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { useState } from 'react';
import getProjectPhases from '@/firebase/get-project-phases';
import OptionsPhases from './options-phases';

function srcset(image, size, rows = 1, cols = 1, id) {
  const parts = id.split(".");

  if (parts.length == 2) {
    if (parts[1] == "pdf") {
      return {
        src: `${"../../../assets/files/pdf-xl.png"}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
          size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
      };    
    }
  }

  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function ImagesListPhase({projectId, phaseId, version}) {
  if (!projectId || !phaseId || !version) return null;

  const { documents } = getProjectPhases(`projectPhase/${projectId}/phases/${phaseId}/versions/${version}/files`);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const pattern = simplePattern;

  return (
    <>
      <ImageList variant="quilted" cols={4} rowHeight={200}>
        {documents.map((item, index) => (
          <ImageListItem
            key={item?.id}
            cols={
              pattern[
                index - Math.floor(index / pattern.length) * pattern.length
              ].cols
            }
            rows={
              pattern[
                index - Math.floor(index / pattern.length) * pattern.length
              ].rows
            }
            sx={{
              opacity: '.7',
              transition: 'opacity .3s linear',
              cursor: 'pointer',
              '&:hover': { opacity: 1 },
            }}
          >
            <OptionsPhases
              imageId={item?.id}
              uid={item?.data?.uid}
              imageURL={item?.data?.imageURL}
              projectId={projectId}
              phaseId={phaseId}
              version={version}
            />

            <img
              {...srcset(
                item?.data?.imageURL,
                200,
                pattern[
                  index - Math.floor(index / pattern.length) * pattern.length
                ].rows,
                pattern[
                  index - Math.floor(index / pattern.length) * pattern.length
                ].cols,
                item?.id
              )}
              alt={item?.data?.uName || item?.data?.uEmail?.split('@')[0]}
              loading="lazy"
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            />
            <Typography
              variant="body2"
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                color: 'white',
                background: 'rgba(0,0,0, .3)',
                p: '5px',
                borderTopRightRadius: 8,
              }}
            >
              {moment(item?.data?.timestamp?.toDate()).fromNow()}
            </Typography>
            <Tooltip
              title={item?.data?.uName || item?.data?.uEmail?.split('@')[0]}
              sx={{
                position: 'absolute',
                bottom: '3px',
                right: '3px',
              }}
            >
            </Tooltip>
          </ImageListItem>
        ))}
      </ImageList>
      {isOpen && (
        <Lightbox
          mainSrc={documents[photoIndex]?.data?.imageURL}
          nextSrc={
            documents[(photoIndex + 1) % documents.length]?.data?.imageURL
          }
          prevSrc={
            documents[(photoIndex + documents.length - 1) % documents.length]
              ?.data?.imageURL
          }
          onCloseRequest={() => setIsOpen(false)}
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % documents.length)
          }
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + documents.length - 1) % documents.length
            )
          }
          imageTitle={documents[photoIndex]?.data?.uName}
          imageCaption={documents[photoIndex]?.data?.uEmail}
        />
      )}
    </>
  );
}

const simplePattern = [
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
];

const fancyPattern = [
  {
    rows: 2,
    cols: 2,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 2,
  },
  {
    rows: 1,
    cols: 2,
  },
  {
    rows: 2,
    cols: 2,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
];
