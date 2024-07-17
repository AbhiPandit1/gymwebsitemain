import DataUriParser from 'datauri/parser.js';
import path from 'path';

const getDataUri = (profilePhoto) => {
  const parser = new DataUriParser();
  const extName = path.extname(profilePhoto.originalName).toString();
  console.log(extName);

  return parser.format(extName, profilePhoto.content);
};

export default getDataUri;
