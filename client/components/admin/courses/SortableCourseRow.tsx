'use client';

import React from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { LOCAL_REGION } from '@/constants/regions';

interface SortableCourseRowProps {
  course: any;
  onEdit: (course: any) => void;
  onDelete: (id: string, title: string) => void;
  onToggleActive: (course: any) => void;
}

export function SortableCourseRow({ course, onEdit, onDelete, onToggleActive }: SortableCourseRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: course.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : undefined,
  };

  const packages = course.packages || [];
  const localPackage = packages.find((pkg: any) => pkg.region === LOCAL_REGION);
  const internationalRegionCount = new Set(
    packages.filter((pkg: any) => pkg.region !== LOCAL_REGION).map((pkg: any) => pkg.region)
  ).size;

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-surface-light/45 transition-colors bg-surface">
      <td className="p-4 pl-6">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-text-secondary hover:text-gold transition-colors touch-none"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="p-4 pl-2">
        <div className="relative h-12 w-20 rounded-lg overflow-hidden bg-bg border border-border">
          {course.imageUrl ? (
            <Image src={course.imageUrl} alt={course.title} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-text-secondary">
              <ImageIcon size={16} className="text-gold/40" />
            </div>
          )}
        </div>
      </td>
      <td className="p-4 max-w-sm">
        <div className="font-bold text-text text-sm truncate">{course.title}</div>
        <div className="text-xs text-text-secondary line-clamp-1 mt-0.5">
          {course.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
        </div>
      </td>
      <td className="p-4 font-bold text-gold">
        {localPackage ? `PKR ${localPackage.price}` : (
          <span className="text-text-secondary font-normal">Not set</span>
        )}
      </td>
      <td className="p-4 text-text-secondary">
        {internationalRegionCount} region{internationalRegionCount === 1 ? '' : 's'}
      </td>
      <td className="p-4 text-center">
        <button
          onClick={() => onToggleActive(course)}
          className="inline-flex items-center justify-center focus:outline-none cursor-pointer text-text-secondary hover:text-gold transition-colors"
          title={course.isActive ? 'Deactivate course' : 'Activate course'}
        >
          {course.isActive ? (
            <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs font-semibold">
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-xs font-semibold">
              Inactive
            </span>
          )}
        </button>
      </td>
      <td className="p-4 pr-6 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(course)}
            className="h-8 w-8 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 flex items-center justify-center transition-all cursor-pointer"
            title="Edit Course"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(course.id, course.title)}
            className="h-8 w-8 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 flex items-center justify-center transition-all cursor-pointer"
            title="Delete Course"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
