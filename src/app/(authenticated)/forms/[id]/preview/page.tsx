'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from 'react-bootstrap';
import Loading from '@/app/components/Loading';
import FormView from '@/app/components/FormView';
import { FormType } from '../../../../../../types/formType';

export default function FormPreviewPage() {
  const { id } = useParams();
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/forms/${id}`)
      if (res.ok) {
        const data = await res.json();
        setForm(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const openResults = () => {
    window.open(`${new URL(window.location.href).origin}/public/${id}`, '_blank')
  }

  if (loading || !form){
    return <Loading />
  }

  return (
    <>
      <div className="d-flex justify-content-end gap-3">
        <Button size="sm" variant="outline-secondary" onClick={openResults}>回答ページ</Button>
      </div>
      <FormView preview={true} form={form} />
    </>
  );
}
