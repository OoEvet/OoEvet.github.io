export interface PhotoOverride {
  location?: string;
  caption?: string;
  alt?: string;
}

export const photoOverrides: Record<string, PhotoOverride> = {
  'DSCF4335.JPG': {
    location: 'Sydney',
    alt: 'Sydney city buildings and a construction crane beneath a bright blue sky.',
  },
  'IMG_4842.JPG': {
    location: 'Sydney Harbour',
    alt: 'Sydney Harbour Bridge at sunset with the Opera House visible across the water.',
  },
  'A7C06504.JPG': {
    location: 'Kangaroo Island',
    alt: 'Close-up of a printed map of Australia highlighting Kangaroo Island.',
  },
  'A7C06961.JPG': {
    location: 'Kangaroo Island',
    alt: 'A photographer peeking around a timber wall inside a rustic wooden structure.',
  },
};
