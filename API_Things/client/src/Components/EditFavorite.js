import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import FavoriteItem from "./FavoriteItem";
import AllServices from "../Services/AllServices";
import Message from "./Message";
import { AuthContext } from "../Context/AuthContext";

const EditFavorite = (props) => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    AllServices.getFavorites().then((data) => {
      setFavorites(data.favorites);
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    AllServices.postFavorite(favorite).then((data) => {
      const { message } = data;
      resetForm();
      if (!message.msgError) {
        AllServices.getFavorites().then((getData) => {
          setFavorites(getData.favorites);
          setMessage(message);
        });
      } else if (message.msgBody === "UnAuthorized") {
        setMessage(message);
        authContext.setUser({ email: "" });
        authContext.setIsAuthenticated(false);
      } else {
        setMessage(message);
      }
    });
  };

  const onChange = (e) => {
    setFavorite({ name: e.target.value });
  };

  const resetForm = () => {
    setFavorite({ name: "" });
  };

  return (
    <div>
      <ul className="list-group">
        {favorites.map((favorite) => {
          return <FavoriteItem key={favorite._id} favorite={favorite} />;
        })}
      </ul>
      <br />
      <form onSubmit={onSubmit}>
        <label htmlFor="favorite">Enter Favorites Information</label>
        <input
          type="text"
          name="genres"
          value={favorite.genres}
          onChange={onChange}
          className="form-control"
          placeholder="Please Enter Genre Names"
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Submit
        </button>
      </form>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default EditFavorite;
