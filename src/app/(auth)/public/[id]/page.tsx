'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spinner, Container, Card, Form, Button, Alert } from 'react-bootstrap';

type Question = {
  id: string;
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: { text: string }[];
};

export default function PublicFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState<{ title: string; description: string; questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/public/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleChange = (questionId: string, value: string | string[]) => {
    setValues((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!form) return;

    const items = form.questions.map((q) => {
      const val = values[q.id];
      return {
        questionId: q.id,
        value: Array.isArray(val) ? val.join(',') : val || '',
      };
    });

    const res = await fetch(`/api/response/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError('送信に失敗しました');
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (!form) {
    return (
      <Container>
        <Card className="p-4">
          <p style={{textAlign: "center", margin: "0"}}>このフォームは存在しないか、非公開です。</p>
        </Card>
      </Container>
    )
  }

  if (submitted) return <Alert variant="success">回答ありがとうございました！</Alert>;

  return (
    <Container>
      <Card className="p-4">
        <h2>{form.title}</h2>
        <p className="text-muted">{form.description}</p>

        <Form>
          {form.questions.map((q) => (
            <Form.Group key={q.id} className="mb-4">
              <Form.Label>{q.label}</Form.Label>
              {q.type === 'text' && (
                <Form.Control
                  type="text"
                  value={values[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === 'radio' &&
                q.options?.map((opt, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    name={q.id}
                    label={opt.text}
                    checked={values[q.id] === opt.text}
                    onChange={() => handleChange(q.id, opt.text)}
                  />
                ))}
              {q.type === 'checkbox' &&
                q.options?.map((opt, idx) => (
                  <Form.Check
                    key={idx}
                    type="checkbox"
                    name={`${q.id}-${idx}`}
                    label={opt.text}
                    checked={(values[q.id] as string[] | undefined)?.includes(opt.text) || false}
                    onChange={(e) => {
                      const prev = (values[q.id] as string[] | undefined) || [];
                      const next = e.target.checked
                        ? [...prev, opt.text]
                        : prev.filter((v) => v !== opt.text);
                      handleChange(q.id, next);
                    }}
                  />
                ))}
            </Form.Group>
          ))}

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="text-end">
            <Button onClick={handleSubmit}>送信</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
