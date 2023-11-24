import React, { useEffect, useState } from "react";
import '../Styles/global.css';
import '../Styles/sidebar.css';
import '../Styles/app.css';
import '../Styles/main.css';
import Notes from '../Components/Notes';
import '../Styles/Form.css';
import api from '../Services/api';
import RadioButton from "../Components/RadioButton";
import jwt from 'jsonwebtoken';

function Annotations() {
  const [title, setTitles] = useState('');
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [selectedValue, setSelectedValue] = useState('all');

  useEffect(() => {
    getAllNotes();
  }, []);

  // Função para obter o ID do usuário do token
  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwt.verify(token, 'seuSegredoDoJWT'); // Substitua 'seuSegredoDoJWT' pelo seu segredo real
      return decoded.userId;
    } catch (error) {
      console.error('Erro ao obter o ID do usuário do token:', error);
      return null;
    }
  };

  /* Criação de anotações */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Obtenha o token do armazenamento local (ou de onde você o estiver armazenando)
      const token = localStorage.getItem('seuToken'); // Substitua 'seuToken' pelo nome real que você está usando

      const response = await api.post('/annotations', {
        title,
        notes,
        priority: false,
        user: getUserIdFromToken(token), // Chame a função para obter o ID do usuário do token
      });

      setTitles('');
      setNotes('');

      if (selectedValue !== 'all') {
        loadNotes(selectedValue);
      } else {
        setAllNotes([...allNotes, response.data]);
      }
      setSelectedValue('all');
    } catch (error) {
      console.error('Erro durante a criação da anotação:', error);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  /* Listar todos as anotações*/
  const getAllNotes = async () => {
    try {
      const response = await api.get('/annotations');
      setAllNotes(response.data);
    } catch (error) {
      console.error('Erro ao obter todas as anotações:', error);
    }
  };

  /* Mostrar anotações por radiobuttons*/
  const loadNotes = async (options) => {
    try {
      const params = { priority: options };
      const response = await api.get('/priorities', { params });

      if (response) {
        setAllNotes(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar anotações por prioridade:', error);
    }
  };

  /* Verificando valor da prioridade  */
  const handleChange = (e) => {
    setSelectedValue(e.value);

    if (e.checked && e.value !== 'all') {
      loadNotes(e.value);
    } else {
      getAllNotes();
    }
  };

  /* Deletando Cards*/
  const handleDelete = async (id) => {
    try {
      const deleteNote = await api.delete(`/annotations/${id}`);

      /* Retornar Cards com base no id após deletar */
      if (deleteNote) {
        setAllNotes(allNotes.filter((note) => note._id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar a anotação:', error);
    }
  };

  return (
    <div id="app">
      <aside>
        <strong>Caderno de Notas</strong>
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="title">Titulo da Anotação</label>
            <input required maxLength="30" value={title} onChange={(e) => setTitles(e.target.value)} />
          </div>
          <div className="input-block">
            <label htmlFor="nota">Anotações</label>
            <textarea required value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button id="btn_submit" type="submit">Salvar</button>
        </form>
        <RadioButton selectedValue={selectedValue} handleChange={handleChange} />
      </aside>

      <main>
        <ul>
          {allNotes.map((data) => (
            <Notes
              key={data._id}
              data={data}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default Annotations;
