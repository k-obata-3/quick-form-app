'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import ConfirmModal from '@/app/components/ConfirmModal';

type FormItem = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

export default function FormListPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getForms();
  }, []);

  const handleDeleteConfirm = async() => {
    if (!selectedForm) return;

    const res = await fetch(`/api/forms/${selectedForm.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setShowModal(false);
      getForms();
    }
  };

  const getForms = async() => {
    fetch('/api/forms')
      .then((res) => res.json())
      .then((data) => {
        setForms(data);
        setLoading(false);
      });
  }

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
                    <Button size="sm" variant="outline-primary" onClick={() => router.push(`/forms/${form.id}/edit`)}>編集</Button>
                    <Button size="sm" variant="outline-secondary" onClick={() => router.push(`/forms/${form.id}/preview`)}>プレビュー</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => { setSelectedForm(form), setShowModal(true) }}>削除</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <ConfirmModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleDeleteConfirm} itemName={selectedForm?.title} />
    </Container>
  );
}
