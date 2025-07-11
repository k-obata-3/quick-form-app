'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from 'react-bootstrap';
import Loading from '@/app/components/Loading';
import FormView from '@/app/components/FormView';

type FormType = {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  questions: Question[];
};

type Question = {
  id: number;
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: { id: number; text: string }[];
};

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

  if (loading || !form){
    return <Loading />
  }

  return (
    <Container>
      <FormView preview={true} form={form} />
    </Container>
  );
}
