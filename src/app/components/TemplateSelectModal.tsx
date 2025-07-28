'use client';

import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Template } from '../../../types/formType';

type TemplateSelectModalProps = {
  show: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
};

export default function TemplateSelectModal({
  show,
  onClose,
  onSelect,
}: TemplateSelectModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (show) {
      setSelectedTemplate(null);
      setTemplates([]);
      fetch('/api/templates')
        .then(res => res.json())
        .then(setTemplates)
    }
  }, [show])

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>テンプレートを選択</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {templates.map((tpl) => (
            <ListGroup.Item
              key={tpl.id}
              active={selectedTemplate?.id === tpl.id}
              action
              onClick={() => setSelectedTemplate(tpl)}
            >
              <div className="fw-bold">{tpl.title}</div>
              <small className="text-muted">{tpl.description}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleSelect} disabled={!selectedTemplate}>
          このテンプレートを使用
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
