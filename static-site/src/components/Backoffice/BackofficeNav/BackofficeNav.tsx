import React, { useState } from "react";
import { Link } from "gatsby";
import classNames from "classnames";
import API from "../../../utils/api";
import CloseIcon from "../../../icons/white-cross-out.inline.svg";
import eyeImage from "../../../images/oeil.jpg";

import "./BackofficeNav.scss";

type Props = {
  isMobile: boolean;
  setMenuIsOpen: Function;
};

export const BackofficeNav = ({ isMobile, setMenuIsOpen }: Props) => {
  const [publishIsLoading, setPublishIsLoading] = useState(false);
  const handleClick = () => {
    setMenuIsOpen(false);
  };

  const handlePublish = async () => {
    setPublishIsLoading(true);
    await API.post("/publish", {});
    setTimeout(function () {
      location.reload();
    }, 4000);
  };

  return (
    <div className="BackofficeNav">
      {isMobile && (
        <button className="BackofficeNav__Close" onClick={handleClick}>
          <CloseIcon />
        </button>
      )}
      <Link onClick={handleClick} to="/" className="BackofficeNav__Head">
        <img className="BackofficeNav__Head__Image" src={eyeImage} alt="" />
      </Link>
      <Link
        onClick={handleClick}
        // @ts-ignore
        activeClassName="BackofficeNav__Link--active"
        className="BackofficeNav__Link"
        to="/admin/dashboard"
      >
        Liste des articles
      </Link>
      <Link
        onClick={handleClick}
        // @ts-ignore
        activeClassName="BackofficeNav__Link--active"
        className="BackofficeNav__Link"
        to="/admin/dashboard/article"
      >
        Ajouter un article
      </Link>
      <Link
        onClick={handleClick}
        // @ts-ignore
        activeClassName="BackofficeNav__Link--active"
        className="BackofficeNav__Link"
        to="/admin/dashboard/categories"
      >
        Modifier les catégories
      </Link>
      <Link
        onClick={handleClick}
        // @ts-ignore
        activeClassName="BackofficeNav__Link--active"
        className="BackofficeNav__Link"
        to="/admin/dashboard/about"
      >
        Modifier la page "À propos"
      </Link>
      <Link
        onClick={handleClick}
        // @ts-ignore
        activeClassName="BackofficeNav__Link--active"
        className="BackofficeNav__Link"
        to="/admin/dashboard/logo"
      >
        Changer de logo
      </Link>
      <button
        onClick={handlePublish}
        className={classNames("BackofficeNav__Button", {
          "BackofficeNav__Button--loading": publishIsLoading,
        })}
      >
        {!publishIsLoading && <span>PUBLIER</span>}
        {publishIsLoading && (
          <span className="BackofficeNav__Button__Spinner"></span>
        )}
      </button>
    </div>
  );
};

export default BackofficeNav;
