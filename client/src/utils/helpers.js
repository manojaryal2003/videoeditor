export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const cloudinaryUrl = (url, transforms = 'f_auto,q_auto') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/${transforms}/`);
};

export const truncate = (str, n) => (str?.length > n ? str.slice(0, n) + '...' : str);
