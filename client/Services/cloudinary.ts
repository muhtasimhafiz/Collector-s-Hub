
export async function cldUpload (file:File, userId:number) {

  const formData = new FormData();
  const file_name = file.name.split('.')[0];
  const public_id = userId + '_' + Date.now() + '_' + file_name;
  
  formData.append("file", file);
  formData.append("upload_preset", "ggtwkfpx");
  formData.append("public_id", public_id);
  
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
      method: "POST",
      body: formData
    });
    return response.json();
  } catch (err) {
    return console.log(err);
  }
}

export async function cldUploadVideo (file:File, userId:number) {

  const formData = new FormData();
  const file_name = file.name.split('.')[0];
  const public_id = userId + '_' + Date.now() + '_' + file_name;
  
  formData.append("file", file);
  formData.append("upload_preset", "ggtwkfpx");
  formData.append("public_id", public_id);
  
  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dlcjonwcq/video/upload", {
      method: "POST",
      body: formData
    });
    return response.json();
  } catch (err) {
    return console.log(err);
  }
}


export async function thumbnailUpload (file:File, userId:number) {

  const formData = new FormData();
  const public_id = userId + '_' + Date.now() + '_thumbnail';
  
  formData.append("file", file);
  formData.append("upload_preset", "qhk6boar");
  formData.append("public_id", public_id);
  
  try {
    const response = await fetch(process.env.REACT_APP_CLOUD_BASE_URL, {
      method: "POST",
      body: formData
    });
    return response.json();
  } catch (err) {
    return console.log(err);
  }
}