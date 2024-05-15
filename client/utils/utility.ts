export const serverURL = "http://localhost:4200/api/";


import { z } from 'zod';

export const imageFileSchema = z.custom((value) => {
  if (!(value instanceof File)) {
    return false;
  }

  const validImageTypes = ['image/gif', 'image/jpg', 'image/png'];
  return validImageTypes.includes(value.type);
}, { message: 'Image file is required' });

