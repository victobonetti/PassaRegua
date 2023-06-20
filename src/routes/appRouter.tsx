import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import PaginaInicial from '../pages/PaginaInicial';
import PaginaUsuarios from '../pages/PaginaUsuarios/PaginaUsuarios';
import PaginaContas from '../pages/PaginaContas';
import PaginaProdutos from '../pages/PaginaProdutos/PaginaProdutos';
import FormularioCriaUsuario from '../pages/PaginaUsuarios/FormularioCriaUsuario';
import FormularioEditaUsuario from '../pages/PaginaUsuarios/FormularioEditaUsuario';
import { Feedback } from '../components/feedback/Feedback';
import { useState } from 'react';
import FeedbackInterface from '../components/feedback/FeedbackInterface';
import FormularioCriaProduto from '../pages/PaginaProdutos/FormularioCriaProduto';
import FormularioEditaProduto from '../pages/PaginaProdutos/FormularioEditaProduto';
// import FormularioEditaProduto from '../pages/PaginaProdutos/FormularioEditaProduto';


export default function AppRouter(): JSX.Element {
  const [feedback, setFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Array<FeedbackInterface>>([]);

  const createFeedback = (() => {
    let isThrottled = false;

    return (isErr:boolean, text:string) => {
      if (isThrottled) {
        return;
      }

      const hasDuplicateFeedback = feedbacks.some((feedback) => feedback.text === text);
      if (feedbacks.length > 3 || hasDuplicateFeedback) {
        return;
      }

      setFeedbacks((prevFeedbacks) => [...prevFeedbacks, { isErr, text }]);
      setFeedback(true);

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 1000); // Define o intervalo de 1 segundo (1000 milissegundos)
    };
  })();


  const close = (self: FeedbackInterface) => {
    setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => {
      feedback.text != self.text
    }));
    if (feedbacks.length < 1) {
      setFeedback(false);
    }
  };

  return (

    <Router>
      <div className='absolute right-4 bottom-2'>
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
      </div>

      <Routes>
        <Route path={'/'} element={<App />} >
          <Route index element={<PaginaInicial feedback={createFeedback} />} />
          <Route path='/usuarios' element={<PaginaUsuarios feedback={createFeedback} />} />
          <Route path='/usuarios/novo' element={<FormularioCriaUsuario feedback={createFeedback} />} />
          <Route path='/usuarios/editar/:id/:usernameParam/:passwordParam' element={<FormularioEditaUsuario feedback={createFeedback} />} />
          <Route path='/contas' element={<PaginaContas feedback={createFeedback} />} />
          <Route path='/produtos' element={<PaginaProdutos feedback={createFeedback} />} />
          <Route path='produtos/novo' element={<FormularioCriaProduto feedback={createFeedback} />} />
          <Route path='produtos/editar/:id/:nameParam/:priceParam' element={<FormularioEditaProduto feedback={createFeedback} />} />
        </Route>
      </Routes>
    </Router >
  );
}
