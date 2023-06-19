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
import FeedbackInterface from '../components/feedback/FeedbackInterface';


export default function AppRouter(): JSX.Element {
  const [feedback, setFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Array<FeedbackInterface>>([]);

  const createFeedback = (isErr: boolean, text: string) => {
    setFeedbacks((prevFeedbacks) => [...prevFeedbacks, { isErr, text }]);
    console.log(feedbacks)
    setFeedback(true);
  };

  const close = (self: FeedbackInterface) => {
    setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => {
      feedback.text == self.text
    }));
    console.log(self)
    console.log(feedbacks)
    if (feedbacks.length < 1) {
      setFeedback(false);
    }
  };

  return (

    <Router>

      {feedback &&
        feedbacks?.map((f) => {
          return (
            <Feedback isError={f.isErr} text={f.text} closeSelf={() => close({
              isErr: f.isErr,
              text: f.text
            })} />
          )
        })

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
