import React from 'react';
import { notFound } from 'next/navigation';
import { getWorkflowById } from '@/lib/serverStore';
import { WebEditor } from './WebEditor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const workflow = await getWorkflowById(params.id);
  if (!workflow) {
    return { title: 'Edit Panduan - Tidak Ditemukan' };
  }
  return {
    title: `Edit: ${workflow.title} - StepFlow Studio`
  };
}

export default async function EditGuidePage({
  params
}: {
  params: { id: string };
}) {
  const workflow = await getWorkflowById(params.id);

  if (!workflow) {
    notFound();
  }

  return <WebEditor initialWorkflow={workflow} />;
}

