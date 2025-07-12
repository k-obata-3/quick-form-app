'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Card } from 'react-bootstrap';
import Loading from '@/app/components/Loading';

type FormType = {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  questions: Question[];
  responses: []
};

type Question = {
  id: number;
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: { id: number; text: string }[];
};

export default function FormResultsPage() {
  const { id } = useParams();
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Container>
      <h5 className="mb-4 text-truncate">{form.title}</h5>

      {form.responses?.length === 0 ? (
        <p>まだ回答がありません。</p>
      ) : (
        form.responses?.map((response: any) => (
          <Card key={response.id} className="mb-4">
            <Card.Header>
              回答日時: {new Date(response.submittedAt).toLocaleDateString()}
            </Card.Header>
            <Card.Body>
              {
                form.questions.map((question: any) => {
                  if(response.answers.length) {
                    const answer = Object.values(response.answers).filter((a: any) => a.questionId === question.id).map((a: any) => a.text)
                    return (
                      <div key={question.id} className="mb-3">
                        <strong>{question.label}</strong>
                        <>
                          {
                            answer.map((ans: string, index: number) => {
                              return <div className="ms-3" key={index}>{ans}</div>
                            })
                          }
                        </>
                      </div>
                    );
                  }
                })
              }
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}
