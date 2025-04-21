import axios from 'axios';
import { AwsBucketUrl } from 'utils/config';
const imageUploadApi = async (value) => {
  let result = await axios.request(value);
  console.log('Aws image name : ', result.data.name);
  let imageName = result.data.name;
  return imageName;
};

export const UploadDocumenttos3Bucket = async (e, container) => {
  console.log(container);
  const reader = new FormData();
  reader.append('file', e.target.files[0]);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${AwsBucketUrl}/app/v1/aws/upload/${container}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: reader
  };
  let imageName = await imageUploadApi(config);
  let totalUrl = `${AwsBucketUrl}/app/v1/aws/getImage/${container}/` + imageName;
  //   console.log(totalUrl);
  return totalUrl;
};
