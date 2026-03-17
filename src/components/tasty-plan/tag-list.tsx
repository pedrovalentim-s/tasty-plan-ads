"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagListProps {
  title?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isPresentation: boolean;
  variant?: 'inline' | 'vertical';
}

export function TagList({ title, tags, onTagsChange, isPresentation, variant = 'inline' }: TagListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
      setIsAdding(false);
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };
  
  const containerClass = variant === 'inline'
    ? "flex flex-wrap gap-2 items-center"
    : "flex flex-col gap-2 items-start";

  return (
    <div className={containerClass}>
       {title && variant === 'vertical' && <h5 className="text-xs text-muted-foreground font-semibold">{title}</h5>}
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="group text-sm">
          {tag}
          {!isPresentation && (
            <button onClick={() => handleRemoveTag(index)} className="ml-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
              <X size={12} />
            </button>
          )}
        </Badge>
      ))}

      {!isPresentation && (
        isAdding ? (
          <div className="flex gap-1">
            <Input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              onBlur={() => setIsAdding(false)}
              className="h-7 text-sm"
              autoFocus
            />
            <Button size="icon" className="h-7 w-7" onClick={handleAddTag}><PlusCircle size={16} /></Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsAdding(true)}>
            <PlusCircle size={14} className="mr-1" /> Adicionar
          </Button>
        )
      )}
    </div>
  );
}
