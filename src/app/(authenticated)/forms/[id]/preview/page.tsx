'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Card, Form } from 'react-bootstrap';

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

  if (loading || !form) return <Container>読み込み中...</Container>;

  return (
    <Container className="">
      <h2 className="mb-3">{form.title}</h2>
      <p className="text-muted">{form.description}</p>
      <a className="text-muted" href={`${new URL(window.location.href).origin}/public/${form.id}`} target="_blank">回答ページ</a>
      <Form>
        {form.questions.map((q) => (
          <Card key={q.id} className="my-4">
            <Card.Body>
              <Form.Label className="fw-bold">{q.label}</Form.Label>

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
