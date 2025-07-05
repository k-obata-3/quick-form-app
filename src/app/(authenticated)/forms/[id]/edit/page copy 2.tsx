'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Button, Card, Container } from 'react-bootstrap';

type Question = {
  id?: number;
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
};

type FormData = {
  title: string;
  description: string;
  questions: Question[];
};

export default function FormEditor() {
  const router = useRouter();
  const { id } = useParams(); // undefinedなら作成モード
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    questions: [],
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/forms/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if(data.error) {
            return;
          }

          setFormData({
            title: data.title ?? "",
            description: data.description ?? "",
            questions: data.questions.map((q: any) => ({
              id: q.id,
              label: q.label,
              type: q.type,
              options: q.options?.map((o: any) => o.text) || [],
            })),
          });
        });
    }
  }, [id]);

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { label: '', type: 'text', options: [] }],
    }));
  };

  const handleSubmit = async () => {
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/forms/${id}` : `/api/forms`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const json = await res.json();
      router.push(`/forms/${json.id}/preview`);
    } else {
      alert('保存に失敗しました');
    }
  };

  return (
    <Container className="my-5">
      <h2>{isEdit ? 'フォームを編集' : 'フォームを作成'}</h2>
      <Form.Group className="mt-4">
        <Form.Label>タイトル</Form.Label>
        <Form.Control
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label>説明</Form.Label>
        <Form.Control
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </Form.Group>

      <h5 className="mt-4">質問一覧</h5>
      {formData.questions.map((q, idx) => (
        <Card key={idx} className="my-3">
          <Card.Body>
            <Form.Group>
              <Form.Label>質問 {idx + 1}</Form.Label>
              <Form.Control
                value={q.label}
                onChange={(e) => {
                  const newQs = [...formData.questions];
                  newQs[idx].label = e.target.value;
                  setFormData({ ...formData, questions: newQs });
                }}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>種類</Form.Label>
              <Form.Select
                value={q.type}
                onChange={(e) => {
                  const newQs = [...formData.questions];
                  newQs[idx].type = e.target.value as any;
                  if (e.target.value === 'text') newQs[idx].options = [];
                  setFormData({ ...formData, questions: newQs });
                }}
              >
                <option value="text">テキスト</option>
                <option value="radio">ラジオボタン</option>
                <option value="checkbox">チェックボックス</option>
              </Form.Select>
            </Form.Group>

            {q.type !== 'text' && (
              <Form.Group className="mt-2">
                <Form.Label>選択肢</Form.Label>
                {q.options?.map((opt, optIdx) => (
                  <Form.Control
                    key={optIdx}
                    className="mb-2"
                    value={opt}
                    onChange={(e) => {
                      const newQs = [...formData.questions];
                      newQs[idx].options![optIdx] = e.target.value;
                      setFormData({ ...formData, questions: newQs });
                    }}
                  />
                ))}
                <Button
                  size="sm"
                  onClick={() => {
                    const newQs = [...formData.questions];
                    newQs[idx].options?.push('');
                    setFormData({ ...formData, questions: newQs });
                  }}
                >
                  ＋ 選択肢を追加
                </Button>
              </Form.Group>
            )}
          </Card.Body>
        </Card>
      ))}

      <div className="d-flex gap-3">
        <Button variant="outline-secondary" onClick={addQuestion}>
          ＋ 質問を追加
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isEdit ? '保存' : '作成'}
        </Button>
      </div>
    </Container>
  );
}
