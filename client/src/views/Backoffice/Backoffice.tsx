import React from "react";
// @ts-ignore
import { Route, Routes } from "react-router-dom";
import Articles from "views/Backoffice/Articles/Articles";
import AddArticle from "views/Backoffice/AddArticle/AddArticle";
import Nav from "views/Backoffice/Nav";

import "./Backoffice.scss";

export const Backoffice = () => {
  return (
    <div className="Backoffice">
      <Nav />
      <div className="Backoffice__Content">
        <Routes>
          <Route path="/" element={<Articles />} />
          <Route path="article" element={<AddArticle />} />
        </Routes>
      </div>
    </div>
  );
};

export default Backoffice;