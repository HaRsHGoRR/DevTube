import React from "react";

const DownloadVideo = ({ children, url }) => {
  return (
    <div>
      <a href={url} download>
        {children}
      </a>
    </div>
  );
};

export default DownloadVideo;
