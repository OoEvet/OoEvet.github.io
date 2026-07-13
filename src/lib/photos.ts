import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';
import exifr from 'exifr';
import { resolve } from 'node:path';

interface ImageModule {
  default: ImageMetadata;
}

interface ExifMetadata {
  DateTimeOriginal?: Date;
  CreateDate?: Date;
  Make?: string;
  Model?: string;
  LensModel?: string;
  FNumber?: number;
  ExposureTime?: number;
  ISO?: number;
  FocalLength?: number;
  FocalLengthIn35mmFormat?: number;
  ImageDescription?: string;
}

export interface Photo {
  image: ImageMetadata;
  title: string;
  filename: string;
  date?: string;
  timestamp: number;
  location?: string;
  caption?: string;
  alt: string;
  camera?: string;
  lens?: string;
  settings: string[];
  tags: string[];
}

const imageModules = import.meta.glob<ImageModule>(
  '/src/assets/photos/*.{jpg,jpeg,JPG,JPEG}',
  { eager: true },
);

const sourcePathsByImageSrc = new Map(
  Object.entries(imageModules).map(([sourcePath, imageModule]) => [imageModule.default.src, sourcePath]),
);

function cleanText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function cleanNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function formatCamera(make?: string, model?: string) {
  if (!make) return model;
  if (!model) return make;
  return model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`;
}

function formatDecimal(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

function formatExposure(seconds: number) {
  if (seconds >= 1) return `${formatDecimal(seconds)} s`;
  const denominator = Math.round(1 / seconds);
  return denominator > 0 ? `1/${denominator} s` : undefined;
}

function formatDate(value?: Date) {
  if (!(value instanceof Date) || Number.isNaN(value.valueOf())) return undefined;
  return value.toISOString().slice(0, 10);
}

export async function getPhotos(): Promise<Photo[]> {
  const entries = await getCollection('photos', ({ data }) => !data.draft);
  const photos = await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = sourcePathsByImageSrc.get(entry.data.image.src);
      if (!sourcePath) {
        throw new Error(`Unable to resolve the source image for photo entry "${entry.id}".`);
      }

      const filename = sourcePath.split('/').pop() ?? sourcePath;
      const filePath = resolve('src/assets/photos', filename);
      const fields = [
        'DateTimeOriginal',
        'CreateDate',
        'Make',
        'Model',
        'LensModel',
        'FNumber',
        'ExposureTime',
        'ISO',
        'FocalLength',
        'FocalLengthIn35mmFormat',
        'ImageDescription',
      ];

      let exif: ExifMetadata | undefined;
      try {
        exif = await exifr.parse(filePath, fields) as ExifMetadata | undefined;
      } catch {
        exif = undefined;
      }

      const takenAt = exif?.DateTimeOriginal ?? exif?.CreateDate;
      const date = formatDate(takenAt);
      const make = cleanText(exif?.Make);
      const model = cleanText(exif?.Model);
      const lens = cleanText(exif?.LensModel);
      const aperture = cleanNumber(exif?.FNumber);
      const exposure = cleanNumber(exif?.ExposureTime);
      const iso = cleanNumber(exif?.ISO);
      const focalLength = cleanNumber(exif?.FocalLength);

      const settings = [
        focalLength === undefined ? undefined : `${formatDecimal(focalLength)} mm`,
        aperture === undefined ? undefined : `ƒ/${formatDecimal(aperture)}`,
        exposure === undefined ? undefined : formatExposure(exposure),
        iso === undefined ? undefined : `ISO ${Math.round(iso)}`,
      ].filter((value): value is string => Boolean(value));

      return {
        image: entry.data.image,
        title: entry.data.title,
        filename,
        date,
        timestamp: takenAt?.valueOf() ?? 0,
        location: entry.data.location,
        caption: entry.data.caption ?? cleanText(exif?.ImageDescription),
        alt: entry.data.alt,
        camera: formatCamera(make, model),
        lens,
        settings,
        tags: entry.data.tags,
      };
    }),
  );

  return photos.sort((a, b) => b.timestamp - a.timestamp || a.filename.localeCompare(b.filename));
}
