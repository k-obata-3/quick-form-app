'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spinner, Container, Card, Form, Button, Alert } from 'react-bootstrap';
import Loading from '@/app/components/Loading';

type Question = {
  id: string;
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: Option[];
};

type Option = {
  id: string,
  text: string
}

type Answer = {
  questionId: string;
  optionId: string | null;
  value: string;
}

export default function PublicFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState<{ title: string; description: string; questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Answer[]>([]);
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

  const handleChange = (e: any, type: string, questionId: string, optionId: string | null) => {
    const key: string = type === 'checkbox' ? `${questionId}${optionId}` : `${questionId}`;
    const item: Answer = {
      questionId: questionId,
      optionId: e.target.checked ? optionId : null,
      value: e.target.checked || type === 'text' ? e.target.value : null,
    }

    setValues((prev) => ({ ...prev, [key]: item }))
  };

  const handleSubmit = async () => {
    if (!form) return;

    const items = Object.values(values).filter(val => val.value?.trim());
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

  if (loading){
    return <Loading />
  }

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
          {form.questions.map((q: Question) => (
            <Form.Group key={q.id} className="mb-4">
              <Form.Label style={{width: "100%"}}>{q.label}</Form.Label>
              {q.type === 'text' && (
                <Form.Control
                  type="text"
                  value={values[Number(q.id)]?.value || ''}
                  onChange={(e) => handleChange(e, q.type, q.id, null)}
                />
              )}
              {q.type === 'radio' &&
                q.options?.map((opt: Option, idx: number) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    name={opt.id}
                    label={opt.text}
                    value={opt.text}
                    checked={values[Number(q.id)]?.optionId === opt.id ? true : false}
                    onChange={(e) => handleChange(e, q.type, q.id, opt.id)}
                  />
                ))}
              {q.type === 'checkbox' &&
                q.options?.map((opt: any, idx: number) => (
                  <Form.Check
                    key={idx}
                    type="checkbox"
                    name={opt.id}
                    label={opt.text}
                    value={opt.text}
                    checked={values[Number(`${q.id}${opt.id}`)]?.optionId === opt.id ? true : false}
                    onChange={(e) => handleChange(e, q.type, q.id, opt.id)}
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
