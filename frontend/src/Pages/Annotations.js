import React, { useEffect, useState } from "react";
import '../Styles/global.css'
import '../Styles/sidebar.css'
import '../Styles/app.css'
import '../Styles/main.css'
import Notes from '../Components/Notes'
import '../Styles/Form.css'
import api from '../Services/api'
import RadioButton from "../Components/RadioButton";


function App() {


  const [title, setTitles] = useState('')
  const [notes, setNotes] = useState('')
  const [allNotes, setAllNotes] = useState([]);
  const [selectedValue, setSelectedValue] = useState('all')


  /*Criação de anotações */
  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/annotations', {
      title,
      notes,
      priority: false
    })

    setTitles('');
    setNotes('');

    if (selectedValue !== 'all') {
      getAllNotes();
    } else {
      setAllNotes([...allNotes, response.data]);
    }
    setSelectedValue('all')
  }

  /*Alteração da cor do botão Salvar conforme preenchimento dos campos */
  useEffect(() => {
    function enableSubmitButton() {
      let btn = document.getElementById('btn_submit')
      btn.style.background = '#ffd3ca'
      if (title && notes) {
        btn.style.background = "#eb8f7a"
      }
    }
    enableSubmitButton()
  }, [title, notes])




  useEffect(() => {

    getAllNotes();

  }, [])

  /* Listar todos as anotações*/
  async function getAllNotes() {
    const response = await api.get('/annotations');
    setAllNotes(response.data)

  }

  /* Mostrar anotações por radiobuttons*/
  async function loadNotes(options) {
    const params = { priority: options };
    const response = await api.get('/priorities', { params });

    if (response) {
      setAllNotes(response.data);
    }
  }

  /*Verificando valor da prioridade  */
  async function handleChange(e) {
    setSelectedValue(e.value);

    if (e.checked && e.value !== 'all') {
      loadNotes(e.value);
    } else {
      getAllNotes();
    }
  }



  /*Deletando Cards*/
  async function handleDelete(id) {
    const deleteNote = await api.delete(`/annotations/${id}`)

    /* Retornar Cards com base no id após deletar */
    if (deleteNote) {
      setAllNotes(allNotes.filter(note => note._id !== id));
    }

  }

  async function handleChangePriority(id) {
    const note = await api.put(`/priorities/${id}`)


    if (note && selectedValue !== 'all') {
      loadNotes(selectedValue);
    } else if (note) {
      getAllNotes();
    }
  }


  return (
    <div id="app">
      <aside>
        <strong>Caderno de Notas</strong>
        <form onSubmit={handleSubmit}>

          <div className="input-block">
            <label htmlFor="title">Titulo da Anotação</label>
            <input required maxLength="30" value={title} onChange={e => setTitles(e.target.value)} />
          </div>
          <div className="input-block">
            <label htmlFor="nota">Anotações</label>
            <textarea
              required
              value={notes}
              onChange={e => setNotes(e.target.value)} />
          </div>
          <button id="btn_submit" type="submit">Salvar</button>
        </form>
        <RadioButton
          selectedValue={selectedValue}
          handleChange={handleChange}
        />
      </aside>

      <main>
        <ul>
          {allNotes.map(data => (
            <Notes
              key={data._id}
              data={data}
              handleDelete={handleDelete}
              handleChangePriority={handleChangePriority}
            />
          ))}

        </ul>
      </main>
    </div>
  );
}

export default App;
