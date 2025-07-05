"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  FormLabel,
  FormGroup,
} from "react-bootstrap";

export default function CreateFormPage() {
  const router = useRouter();

  // フォーム項目の配列 state
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      type: "text", // text, radio, checkbox
      label: "",
      options: [""], // ラジオやチェック用の選択肢
    },
  ]);

  // 項目の種類を変える
  const handleTypeChange = (id: number, newType: any) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id
          ? {
              ...q,
              type: newType,
              options: newType === "text" ? [""] : q.options.length ? q.options : [""],
            }
          : q
      )
    );
  };

  // ラベル変更
  const handleLabelChange = (id: number, newLabel: any) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, label: newLabel } : q))
    );
  };

  // 選択肢変更
  const handleOptionChange = (qId: number, idx: number, val: string) => {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id === qId) {
          const newOptions = [...q.options];
          newOptions[idx] = val;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  // 選択肢追加
  const addOption = (qId: number) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === qId ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  // 項目追加
  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      {
        id: Date.now() + Math.random(),
        type: "text",
        label: "",
        options: [""],
      },
    ]);
  };

  // 項目削除
  const removeQuestion = (id: number) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  };

  // フォーム送信
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("フォーム内容", questions);
    (async() => {
      const res = await fetch('/api/forms', {
        method: 'POST',
        body: JSON.stringify({ title: "新しいフォーム" }),
        headers: { "Content-Type": "application/json" }
      });
      if(res && res.ok) {
        const newForm = await res.json();
        console.log(newForm);
        router.push("/formSaved")
      }
    })()
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">フォーム作成</h1>

      <Form onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <Card key={q.id} className="mb-4">
            <Card.Body>
              <Row className="align-items-center mb-3">
                <Col md={8}>
                  <FormGroup controlId={`label-${q.id}`}>
                    <FormLabel>
                      質問 {i + 1}
                    </FormLabel>
                    <Form.Control
                      type="text"
                      placeholder="質問内容を入力"
                      value={q.label}
                      onChange={(e) => handleLabelChange(q.id, e.target.value)}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup controlId={`type-${q.id}`}>
                    <FormLabel>質問タイプ</FormLabel>
                    <Form.Select
                      value={q.type}
                      onChange={(e) => handleTypeChange(q.id, e.target.value)}
                    >
                      <option value="text">テキスト入力</option>
                      <option value="radio">単一選択（ラジオボタン）</option>
                      <option value="checkbox">複数選択（チェックボックス）</option>
                    </Form.Select>
                  </FormGroup>
                </Col>
              </Row>

              {(q.type === "radio" || q.type === "checkbox") && (
                <>
                  <FormLabel>選択肢</FormLabel>
                  {q.options.map((opt, idx) => (
                    <InputGroup className="mb-2" key={idx}>
                      <Form.Control
                        type="text"
                        placeholder={`選択肢 ${idx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(q.id, idx, e.target.value)}
                        required
                      />
                      {q.options.length > 1 && (
                        <Button
                          variant="outline-danger"
                          onClick={() => {
                            // 選択肢削除は省略（要望あれば対応可）
                            // 今は削除ボタン無し
                          }}
                          disabled
                        >
                          ×
                        </Button>
                      )}
                    </InputGroup>
                  ))}
                  <Button variant="link" onClick={() => addOption(q.id)}>
                    ＋ 選択肢を追加
                  </Button>
                </>
              )}

              <Button
                variant="outline-danger"
                className="mt-3"
                onClick={() => removeQuestion(q.id)}
                disabled={questions.length === 1}
              >
                この質問を削除
              </Button>
            </Card.Body>
          </Card>
        ))}

        <Button variant="secondary" onClick={addQuestion} className="me-3">
          ＋ 質問を追加
        </Button>

        {/* <Button type="submit" variant="primary" onClick={() => router.push("/formSaved")}> */}
        <Button type="submit" variant="primary">
          フォームを保存
        </Button>
      </Form>
    </Container>
  );
}
