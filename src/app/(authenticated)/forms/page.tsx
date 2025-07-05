'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

type FormItem = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

export default function FormListPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/forms')
      .then((res) => res.json())
      .then((data) => {
        setForms(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Container>読み込み中...</Container>;

  return (
    <Container className="">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>作成したフォーム一覧</h2>
        <Button onClick={() => router.push('/forms/new')}>＋ 新規フォーム作成</Button>
      </div>

      <Row>
        {forms.length === 0 ? (
          <p>まだフォームが作成されていません。</p>
        ) : (
          forms.map((form) => (
            <Col key={form.id} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{form.title}</Card.Title>
                  <Card.Text>{form.description ?? "-"}</Card.Text>
                  <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                    作成日: {new Date(form.createdAt).toLocaleDateString()}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => router.push(`/forms/${form.id}/edit`)}
                    >
                      編集
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => router.push(`/forms/${form.id}/preview`)}
                    >
                      プレビュー
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
