'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

type FormItem = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const userName = session?.user?.userName || 'ユーザー';
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/forms')
      .then((res) => res.json())
      .then((data: FormItem[]) => {
        setForms(data);
        setLoading(false);
      });
    console.log(session?.user)
  }, []);

  const totalForms = forms.length;
  const thisMonthForms = forms.filter((f) => {
    const d = new Date(f.createdAt);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const totalResponses = totalForms * 3 + Math.floor(Math.random() * 5); // 仮の値

  const recentForms = forms.slice(0, 3);

  if (loading) return <Container>読み込み中...</Container>;

  return (
    <Container>
      <h2 className="mb-3">こんにちは、{userName}さん</h2>
      <div className="d-flex justify-content-end gap-2 mt-4 mb-4">
        <Button variant="outline-secondary" onClick={() => router.push('/forms')}>
          フォーム一覧
        </Button>
        <Button variant="primary" onClick={() => router.push('/forms/new')}>
          ＋ フォームを作成
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>フォーム総数</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {totalForms}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>回答総数</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {totalResponses}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>今月の新規フォーム</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {thisMonthForms}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <h4>最近作成したフォーム</h4>
      </div>

      <Row>
        {recentForms.length === 0 ? (
          <p className="text-muted">まだフォームは作成されていません。</p>
        ) : (
          recentForms.map((form) => (
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
