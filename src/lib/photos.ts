import type { ImageMetadata } from 'astro';
import exifr from 'exifr';
import { resolve } from 'node:path';
import { photoOverrides } from './photo-overrides';

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
  filename: string;
  date?: string;
  timestamp: number;
  location?: string;
  caption?: string;
  alt: string;
  camera?: string;
  lens?: string;
  settings: string[];
}

const imageModules = import.meta.glob<ImageModule>(
  '/src/assets/photos/*.{jpg,jpeg,JPG,JPEG}',
  { eager: true },
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
  const photos = await Promise.all(
    Object.entries(imageModules).map(async ([sourcePath, imageModule]) => {
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

      const override = photoOverrides[filename] ?? {};
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
        image: imageModule.default,
        filename,
        date,
        timestamp: takenAt?.valueOf() ?? 0,
        location: override.location,
        caption: override.caption ?? cleanText(exif?.ImageDescription),
        alt: override.alt ?? `Personal photograph${date ? ` taken on ${date}` : ''}.`,
        camera: formatCamera(make, model),
        lens,
        settings,
      };
    }),
  );

  return photos.sort((a, b) => b.timestamp - a.timestamp || a.filename.localeCompare(b.filename));
}
