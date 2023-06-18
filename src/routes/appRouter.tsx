import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import PaginaInicial from '../pages/PaginaInicial';
import PaginaUsuarios from '../pages/PaginaUsuarios/PaginaUsuarios';
import PaginaContas from '../pages/PaginaContas';
import PaginaProdutos from '../pages/PaginaProdutos';
import FormularioCriaUsuario from '../pages/PaginaUsuarios/FormularioCriaUsuario';
import FormularioEditaUsuario from '../pages/PaginaUsuarios/FormularioEditaUsuario';
import { Feedback } from '../components/feedback/Feedback';
import { useState } from 'react';

export default function AppRouter(): JSX.Element {

  const [feedback, setFeedback] = useState(false);
  const [isError, setIsError] = useState(false);
  const [text, setText] = useState('')

  const createFeedback = (isErr: boolean, text: string) => {
    close()
    setText(text);
    setIsError(isErr)
    setFeedback(true)
  }

  const close = () => {
    setFeedback(false)
  }

  return (

    <Router>

      {feedback &&
        <Feedback isError={isError} text={'teste'} closeSelf={close} />
      }

      <Routes>
        <Route path={'/'} element={<App />} >
          <Route index element={<PaginaInicial feedback={createFeedback} />} />
          <Route path='/usuarios' element={<PaginaUsuarios feedback={createFeedback} />} />
          <Route path='/usuarios/novo' element={<FormularioCriaUsuario feedback={createFeedback} />} /> 
          <Route path='/usuarios/editar/:id/:usernameParam/:passwordParam' element={<FormularioEditaUsuario feedback={createFeedback} />} />
          <Route path='/contas' element={<PaginaContas feedback={createFeedback} />} />
          <Route path='/produtos' element={<PaginaProdutos feedback={createFeedback} />} />
        </Route>
      </Routes>
    </Router>
  );
}
