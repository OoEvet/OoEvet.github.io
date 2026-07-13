export interface PhotoOverride {
  location?: string;
  caption?: string;
  alt?: string;
}

export const photoOverrides: Record<string, PhotoOverride> = {
  'A7C06504.JPG': {
    location: 'Kangaroo Island',
    alt: 'Close-up of a printed map of Australia highlighting Kangaroo Island.',
  },
};
