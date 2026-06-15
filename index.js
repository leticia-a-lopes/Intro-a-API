const express = require('express');
const app = express();
app.use(express.json());

// "Banco de dados" em memória — como uma tabela SQL, mas sem persistência
let itens = [
  { id: 1, nome: 'Arroz', quantidade: 2, comprado: false },
  { id: 2, nome: 'Feijão', quantidade: 1, comprado: false },
];
let proximoId = 3;

// GET /itens — equivalente a SELECT * FROM itens
app.get('/itens', (req, res) => {
  res.status(200).json(itens);
});

// GET /itens/:id — equivalente a SELECT * FROM itens WHERE id = ?
app.get('/itens/:id', (req, res) => {
  const item = itens.find(i => i.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  res.status(200).json(item);
});

// POST /itens — equivalente a INSERT INTO itens (nome, quantidade, comprado) VALUES (?, ?, ?)
app.post('/itens', (req, res) => {
  const { nome, quantidade } = req.body;

  if (!nome || !quantidade) {
    return res.status(400).json({ erro: 'nome e quantidade são obrigatórios' });
  }

  const novoItem = { id: proximoId++, nome, quantidade, comprado: false };
  itens.push(novoItem);

  res.status(201).json(novoItem);
});

// PATCH /itens/:id — equivalente a UPDATE itens SET ... WHERE id = ?
app.patch('/itens/:id', (req, res) => {
  const item = itens.find(i => i.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  const { nome, quantidade, comprado } = req.body;
  if (nome !== undefined) item.nome = nome;
  if (quantidade !== undefined) item.quantidade = quantidade;
  if (comprado !== undefined) item.comprado = comprado;

  res.status(200).json(item);
});

// DELETE /itens/:id — equivalente a DELETE FROM itens WHERE id = ?
app.delete('/itens/:id', (req, res) => {
  const index = itens.findIndex(i => i.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  itens.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
