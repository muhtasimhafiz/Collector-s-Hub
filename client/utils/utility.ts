export const serverURL = "http://localhost:4200";
export const cloudinary = require('cloudinary').v2;
import {Cloudinary} from "@cloudinary/url-gen";

import { z } from 'zod';

export const imageFileSchema = z.custom((value) => {
  if (!(value instanceof File)) {
    return false;
  }

  const validImageTypes = ['image/gif', 'image/jpg', 'image/png'];
  return validImageTypes.includes(value.type);
}, { message: 'Image file is required' });

export const cloudN = new Cloudinary({
  cloud: {
    cloudName: 'dlcjonwcq',
    apiKey:'683883122435356',
    apiSecret:'w3O7ZMwbuSqghXOyIVaaxK_sa04'
  }
});