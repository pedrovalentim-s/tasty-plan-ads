"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string | number;
  displayValue?: string;
  onSave: (value: string | number) => void;
  isPresentation: boolean;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  type?: 'text' | 'number';
  prefix?: string;
  suffix?: string;
}

export function EditableField({
  value,
  displayValue,
  onSave,
  isPresentation,
  className,
  inputClassName,
  multiline = false,
  type = 'text',
  prefix,
  suffix
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      if (inputRef.current && 'select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    if (type === 'number') {
      onSave(Number(currentValue));
    } else {
      onSave(currentValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const finalDisplayValue = displayValue !== undefined 
    ? displayValue 
    : `${prefix || ''}${String(value)}${suffix || ''}`;

  if (isPresentation || !onSave) {
    return <div className={cn("py-1", className)}>{finalDisplayValue}</div>;
  }

  if (isEditing) {
    const InputComponent = multiline ? Textarea : Input;
    return (
      <div className="relative">
        <InputComponent
          ref={inputRef as any}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn("py-1 h-auto", multiline ? "min-h-[60px]" : "", inputClassName)}
          type={type}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("group relative cursor-pointer rounded-md hover:bg-primary/10 p-1 -m-1 transition-colors", className)}
      onClick={() => setIsEditing(true)}
    >
      {finalDisplayValue || <span className="text-muted-foreground/50">Clique para editar</span>}
      <Button variant="ghost" size="icon" className="absolute top-1/2 right-0 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100">
        <Edit2 size={14} />
      </Button>
    </div>
  );
}
