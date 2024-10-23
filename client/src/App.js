import React, {useState, useMemo} from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navigation from "./components/Navigation/Navigation";
import Expenses from "./components/Expenses/Expenses";
import Income from "./components/Income/Income";
import Dashboard from "./components/Dashboard/Dashboard";
import { MainLayout } from './styles/Layouts';
import styled from "styled-components";
import bg from './img/bg.png'
import Layout from './components/Layout/Layout'
import Transactions from './components/Transactions/Transactions';

function App() {
  const [active, setActive] = useState(1)
  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Transactions />
      case 3:
        return <Income />
      case 4: 
        return <Expenses />
      default: 
        return <Dashboard />
    }
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <AppStyled bg={bg} className="App">
              <Layout>
              <MainLayout>
              <Navigation active={active} setActive={setActive} />
              <main>
                 {displayData()}
              </main>
              </MainLayout>
              </Layout>
              </AppStyled>
            </ProtectedRoutes>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;