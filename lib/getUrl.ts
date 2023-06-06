import { storage } from "@/appwrite";
import { image } from "@/typings";

const getUrl = async (image: image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);
  return url;
};
export default getUrl;