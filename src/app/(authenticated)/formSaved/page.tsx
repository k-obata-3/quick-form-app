"use client";

import React from "react";
import { useRouter } from 'next/navigation'
import { Container, Button, Card } from "react-bootstrap";

export default function FormSavedPage() {
  const router = useRouter();

  // TODO: 前画面から受け取る
  const formId: number = 10;
  const formTitle: string = "テストフォーム";

  return (
    <Container className="my-5 text-center">
      <Card className="p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="mb-3">フォームを保存しました！</h2>
        <p className="mb-4 fs-5">
          フォーム名: <strong>{formTitle || "（無題フォーム）"}</strong>
        </p>

        <Button
          variant="primary"
          className="me-3"
          onClick={() => router.push(`/forms/${formId}/edit`)}
        >
          フォームを編集する
        </Button>

        <Button
          variant="success"
          onClick={() => router.push(`/forms/${formId}/preview`)}
        >
          フォームをプレビューする
        </Button>

        <div className="mt-4">
          <Button variant="outline-secondary" onClick={() => router.push("/dashboard")}>
            トップページに戻る
          </Button>
        </div>
      </Card>
    </Container>
  );
}
