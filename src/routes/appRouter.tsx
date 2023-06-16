import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import PaginaInicial from '../pages/PaginaInicial';
import PaginaUsuarios from '../pages/PaginaUsuarios';
import PaginaContas from '../pages/PaginaContas';
import PaginaProdutos from '../pages/PaginaProdutos';
import FormularioCriaUsuario from '../pages/FormularioCriaUsuario';

export default function AppRouter(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<App />} >
          <Route index element={<PaginaInicial />} />
          <Route path='/usuarios' element={<PaginaUsuarios />} />
          <Route path='/usuarios/novo' element={<FormularioCriaUsuario />} />
          <Route path='/contas' element={<PaginaContas />} />
          <Route path='/produtos' element={<PaginaProdutos />} />
        </Route>
      </Routes>
    </Router>
  );
}
