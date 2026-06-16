'use client';

import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectPayload } from '@/lib/types';

interface ModeSelectorProps {
  form: UseFormReturn<ProjectPayload>;
  currentMode: 'general' | 'detailed';
}

export function ModeSelector({ form, currentMode }: ModeSelectorProps) {
  return (
    <Tabs
      defaultValue={currentMode}
      onValueChange={(value) => form.setValue('mode', value as 'detailed' | 'general')}
      className="mb-6 w-full"
    >
      <TabsList variant="line" className="w-full flex justify-start border-b border-slate-200 dark:border-slate-800/60 pb-1">
        {(['detailed', 'general'] as const).map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex-1 relative cursor-pointer after:hidden data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent bg-transparent"
          >
            {tab === 'detailed' ? 'Detailed Streams' : 'General Input'}
            {currentMode === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 dark:bg-slate-100 rounded-t-full"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
