import type { Region, PackageTier } from '@/constants/regions';

export interface PackageFormValues {
  region: Region;
  packageTier: PackageTier;
  currency: string;
  title?: string | null;
  description: string;
  imageUrl: string;
  price: number;
}

export interface CourseFormValues {
  title: string;
  description: string;
  category: 'ONE_ON_ONE' | 'GROUP';
  features: string[];
  imageUrl: string;
  imageId: string;
  isActive: boolean;
  packages: PackageFormValues[];
}

export interface CourseSubmitInput {
  title: string;
  description: string;
  category: 'ONE_ON_ONE' | 'GROUP';
  features: string[];
  imageUrl: string;
  imageId: string;
  isActive?: boolean;
  packages: PackageFormValues[];
}
