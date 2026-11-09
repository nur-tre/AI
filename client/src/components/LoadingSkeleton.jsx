import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 animate-pulse">
      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-24" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 animate-pulse flex items-center space-x-4">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
    </div>
  );
}
