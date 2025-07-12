'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Card } from 'react-bootstrap';
import Loading from '@/app/components/Loading';

type Props = {
  params: {
    formId: string;
  };
};

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
  responses: []
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
    <Container className="py-5">
      <h2 className="mb-4">回答結果：{form.title}</h2>

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
                  if(!response.answers.length) return <></>
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
                })
              }
            </Card.Body>
            {/* <Card.Body>
              {form.questions.map((question: any) => {
                console.log(response.answers)
                const answer = response.answers.map((a: any) => a.questionId === question.id);
                let displayValue: string[] = [];
                let outputText = ''
                if (!answer.length) {
                  displayValue.push('(未回答)');
                // } else if (question.type === 'checkbox') {
                //   // チェックボックスは JSON 文字列で保存されていると想定
                //   try {
                //     const selected = JSON.parse(answer.text);
                //     displayValue = Array.isArray(selected)
                //       ? selected.join(', ')
                //       : String(selected);
                //   } catch {
                //     displayValue = answer.text;
                //   }
                } else {
                  // displayValue = answer.text;
                  answer.map((ans: any) => {
                    displayValue.push(ans.text)
                  })
                }

                // console.log(displayValue)
                outputText = displayValue.map((val: any) => val.join(',')).join('')

                return (
                  <div key={question.id} className="mb-3">
                    <strong>{question.label}</strong>
                    <div className="ms-3">{outputText}</div>
                  </div>
                );
              })}
            </Card.Body> */}
          </Card>
        ))
      )}
    </Container>
  );
}
