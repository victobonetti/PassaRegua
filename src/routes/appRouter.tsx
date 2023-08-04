import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import PaginaInicial from '../pages/PaginaInicial';
import PaginaUsuarios from '../pages/PaginaUsuarios/PaginaUsuarios';
import PaginaContas from '../pages/paginaContas/PaginaContas';
import PaginaProdutos from '../pages/PaginaProdutos/PaginaProdutos';
import FormularioCriaUsuario from '../pages/PaginaUsuarios/FormularioCriaUsuario';
import FormularioEditaUsuario from '../pages/PaginaUsuarios/FormularioEditaUsuario';
import { Feedback } from '../components/feedback/Feedback';
import FeedbackInterface from '../components/feedback/FeedbackInterface';
import FormularioCriaProduto from '../pages/PaginaProdutos/FormularioCriaProduto';
import FormularioEditaProduto from '../pages/PaginaProdutos/FormularioEditaProduto';
import PaginaCriarConta from '../pages/paginaContas/PaginaCriarConta';
import PaginaItems from '../pages/paginaContas/PaginaItems';
import PaginaAdicionarItem from '../pages/paginaContas/PaginaAdicionarItem';
import PaginaCriarNota from '../pages/paginaContas/PaginaCriarNota';
import FormularioEditaPreco from '../pages/paginaContas/FormularioEditaPreco';
import { User } from '../interfaces/User';
import Account from '../interfaces/Account';
import Product from '../interfaces/Product';
import { invoke } from '@tauri-apps/api';
import PaginaCriaPagamentos from '../pages/paginaContas/PaginaCriaPagamentos';
import PaginaPagamentos from '../pages/paginaContas/PaginaPagamentos';
import PaginaLogs from '../pages/paginaLogs/PaginaLogs';
import fetchService from '../services/fetchService';


export const FeedbackContext = createContext<{
  feedback: boolean;
  feedbacks: FeedbackInterface[];
  createFeedback: (isErr: boolean, text: string) => void;
  close: (self: FeedbackInterface) => void;
  loading: boolean;
  manageLoading: (active: boolean) => void;
  // fetchUsers: () => Promise<User[]>;
  // fetchAccounts: () => Promise<Account[]>;
  // fetchProducts: () => Promise<Product[]>;
}>({
  feedback: false,
  feedbacks: [],
  createFeedback: () => { },
  close: () => { },
  loading: false,
  manageLoading: () => { },
  // fetchUsers: async () => [],
  // fetchAccounts: async () => [],
  // fetchProducts: async () => [],
});



export default function AppRouter(): JSX.Element {
  const [feedback, setFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);

  //global data
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFirstData = async () => {
      setFirstLoad(true)
      setAccounts(await fetchService.fetchAccounts())
      setProducts(await fetchService.fetchProducts())
      setUsers(await fetchService.fetchUsers())
      setFirstLoad(false)
    }
    fetchFirstData()
  }, [])

  const createFeedback = (isErr: boolean, text: string) => {
    let isThrottled = false;

    if (isThrottled) {
      return;
    }

    const hasDuplicateFeedback = feedbacks.some((feedback) => feedback.text == text);
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

  const close = (self: FeedbackInterface) => {
    setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => feedback.text !== self.text));
    if (feedbacks.length < 1) {
      setFeedback(false);
    }
  };

 const manageLoading = (active: boolean) => {
    setLoading(active);
  }

  return (

    <Router>
      {feedback &&
        <div className='absolute right-4 bottom-2'>
          {feedbacks?.map((f, i) => {
            return (
              <Feedback
                key={i} // Adicione uma chave única para cada feedback
                isError={f.isErr}
                text={f.text}
                closeSelf={() => close(f)}
              />
            );

          })}  </div>}

      <FeedbackContext.Provider value={{ feedback, feedbacks, createFeedback, close, loading, manageLoading }}>
        <Routes>
          <Route path={'/'} element={<App load={loading} firstLoad={firstLoad} dataStorage={{ users: users, accounts: accounts, products: products }} />}>

            <Route index element={<PaginaInicial data={accounts} setData={setAccounts} />} />
            <Route path='/usuarios' element={<PaginaUsuarios data={users} setData={setUsers} />} />
            <Route path='/usuarios/novo' element={<FormularioCriaUsuario data={users} setData={setUsers}  />} />
            <Route
              path='/usuarios/editar/:id/:usernameParam/:cpfParam/:phoneParam'
              element={<FormularioEditaUsuario data={users} setData={setUsers} />}
            />
            <Route path='/contas' element={<PaginaContas data={accounts} setData={setAccounts} />} />
            <Route path='/contas/novo' element={<PaginaCriarConta />} />
            <Route path='/contas/items/:id' element={<PaginaItems />} />
            <Route path='/contas/items/add/:id' element={<PaginaAdicionarItem />} />
            <Route path='/contas/items/note/:id/:itemId/:noteText?' element={<PaginaCriarNota />} />
            <Route path='/contas/pagamentos/:id/:total/:paid' element={<PaginaPagamentos />} />
            <Route path='/contas/pagamentos/add/:id/:total/:paid' element={<PaginaCriaPagamentos />} />
            <Route path='/contas/items/price/:id/:itemId/:priceParam/:quantityParam' element={< FormularioEditaPreco />} />
            {/* /contas/items/price/${data.account_id}/${data.id}/${data.price}/${data.quantity}` */}

            <Route path='/produtos' element={<PaginaProdutos data={products} setData={setProducts} />} />
            <Route path='produtos/novo' element={<FormularioCriaProduto />} />
            <Route path='logs' element={<PaginaLogs />} />
            <Route
              path='produtos/editar/:id/:nameParam/:priceParam'
              element={<FormularioEditaProduto data={products} setData={setProducts} />}
            />
          </Route>
        </Routes>
      </FeedbackContext.Provider >

    </Router >

  );
}
