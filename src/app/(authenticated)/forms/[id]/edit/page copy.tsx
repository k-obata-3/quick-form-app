"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Spinner,
} from "react-bootstrap";

export type Form = {
  id: number,
  title: string,
  description: string,
  questions: FormQuestion[],
}

export type FormQuestion = {
  id: number,
  type: string,
  label: string,
  options?: FormOption[],
}

export type FormOption = {
  id?: number,
  text?: string,
  options?: FormOption[],
}

export default function FormEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    // APIから取得する想定
    setTimeout(() => {

    // モックデータ（実際はAPIで取得）
    const mockForm: Form = {
      id: 1,
      title: "アンケート編集サンプル",
      description: "自由に編集してください",
      questions: [
        {
          id: 101,
          type: "text",
          label: "あなたの名前は？",
          options: []
        },
        {
          id: 102,
          type: "radio",
          label: "性別を選んでください",
          options: [
            { id: 1, text: "男性" },
            { id: 2, text: "女性" }
          ]
        }
      ]
    };

      setForm(mockForm); // 仮読み込み
    }, 300);
  }, [id]);

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updated: FormQuestion[] = [...form!.questions];
    if(form && updated) {
      updated[index].type = value;
      setForm({ ...form, questions: updated });
    }
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated: FormQuestion[] = [...form!.questions];
    if(form && updated) {
      updated[qIndex].options![optIndex].text = value;
      setForm({ ...form, questions: updated });
    }
  };

  const addQuestion = () => {
    const newQ = {
      id: Date.now(),
      type: "text",
      label: "",
      options: [{ id: 1, text: "" }]
    };
    if(form) {
      setForm({ ...form, questions: [...form.questions, newQ] });
    }
  };

  const removeQuestion = (index: number) => {
    const updated = [...form!.questions];
    if(form && updated) {
      updated.splice(index, 1);
      setForm({ ...form, questions: updated });
    }
  };

  const addOption = (qIndex: number) => {
    const updated = [...form!.questions];
    if(form && updated) {
      updated[qIndex].options?.push({ id: Date.now(), text: "" });
      setForm({ ...form, questions: updated });
    }
  };

  const handleSave = () => {
    console.log("保存する内容:", form);
    alert("フォームを保存しました！（開発中）");
    router.push(`/forms/${form?.id}/preview`);
  };

  if (!form) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>読み込み中...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-3">フォーム編集</h1>

      <Form.Group className="mb-3">
        <Form.Label>フォーム名</Form.Label>
        <Form.Control
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>フォームの説明</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </Form.Group>

      {form.questions.map((q, index) => (
        <Card className="mb-4" key={q.id}>
          <Card.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>質問内容</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.label}
                    onChange={(e) =>
                      handleQuestionChange(index, "label", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>質問タイプ</Form.Label>
                  <Form.Select
                    value={q.type}
                    onChange={(e) =>
                      handleQuestionChange(index, "type", e.target.value)
                    }
                  >
                    <option value="text">テキスト</option>
                    <option value="radio">ラジオボタン</option>
                    <option value="checkbox">チェックボックス</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {(q.type === "radio" || q.type === "checkbox") && (
              <>
                <Form.Label>選択肢</Form.Label>
                {q.options?.map((opt, optIdx) => (
                  <InputGroup className="mb-2" key={opt.id}>
                    <Form.Control
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        handleOptionChange(index, optIdx, e.target.value)
                      }
                    />
                  </InputGroup>
                ))}
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => addOption(index)}
                >
                  + 選択肢を追加
                </Button>
              </>
            )}

            <Button
              variant="outline-danger"
              className="mt-3"
              onClick={() => removeQuestion(index)}
              disabled={form.questions.length === 1}
            >
              この質問を削除
            </Button>
          </Card.Body>
        </Card>
      ))}

      <div className="d-flex justify-content-start mb-4">
        <Button variant="secondary" className="me-3" onClick={addQuestion}>
          ＋ 質問を追加
        </Button>
        <Button variant="primary" onClick={handleSave}>
          フォームを保存
        </Button>
      </div>
    </Container>
  );
}
