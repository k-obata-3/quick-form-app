'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Card, Form, Button } from 'react-bootstrap';
import Loading from '@/app/components/Loading';

type Question = {
  id: number;
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: { id: number; text: string }[];
};

type FormType = {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  questions: Question[];
};

export default function FormPreviewPage() {
  const { id } = useParams();
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({}); // questionId: value

  useEffect(() => {
    if (typeof id === 'string') {
      fetch(`/api/forms/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm(data);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading || !form){
    return <Loading />
  }

  const openResults = () => {
    window.open(`${new URL(window.location.href).origin}/public/${form.id}`, '_blank')
  }

  return (
    <Container className="">
      <div className="d-flex justify-content-end">
        <Button size="sm" variant="outline-secondary" onClick={openResults}>回答ページ</Button>
      </div>
      <Card className="my-4">
        <Card.Body>
          <h5 className="mb-3 text-muted text-break" style={{width: "100%"}}>{form.title}</h5>
          <p className="text-muted text-break" style={{width: "100%"}}>{form.description}</p>
        </Card.Body>
      </Card>
      <Form>
        {form.questions.map((q) => (
          <Card key={q.id} className="my-4">
            <Card.Body>
              <Form.Label className="fw-bold" style={{width: "100%"}}>{q.label}</Form.Label>

              {q.type === 'text' && (
                <Form.Control
                  type="text"
                  disabled
                  placeholder="ここに入力（プレビュー中）"
                />
              )}

              {q.type === 'radio' &&
                q.options?.map((opt) => (
                  <Form.Check
                    key={opt.id}
                    type="radio"
                    label={opt.text}
                    name={`q-${q.id}`}
                    disabled
                  />
                ))}

              {q.type === 'checkbox' &&
                q.options?.map((opt) => (
                  <Form.Check
                    key={opt.id}
                    type="checkbox"
                    label={opt.text}
                    name={`q-${q.id}`}
                    disabled
                  />
                ))}
            </Card.Body>
          </Card>
        ))}
      </Form>
    </Container>
  );
}
