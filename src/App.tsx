import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Inventory from "./Pages/Inventory";
import DogFeedingMgmt from "./Pages/DogFeedingMgmt";
import SideMenu from "./Components/SideMenu";
import PlantWatering from "./Pages/PlantWatering";
import StyledApp from "./Components/styled/StyledApp";
import { BrowserView, MobileView, isMobile } from 'react-device-detect';

function App() {
  return (
    <StyledApp isMobile={isMobile} >
      <BrowserView>
        <SideMenu />
      </BrowserView>
      <Layout>
        <Routes>
          <Route path="inventory" element={<Inventory />} />
          <Route path="plants-watering" element={<PlantWatering />} >
            <Route path=":plantId" element={<PlantWatering />} />
          </Route>
          <Route path="dog-feeding-mgt" element={<DogFeedingMgmt />} />
        </Routes>
      </Layout>
      <MobileView>
        <SideMenu isMobile />
      </MobileView>
    </StyledApp>
  );
}

export default App;
