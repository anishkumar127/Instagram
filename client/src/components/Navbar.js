import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const Navbar = () => {
  const searchModal = useRef(null);
  const [userDetails, setUserDetails] = useState([]);

  const [search, setSearch] = useState("");
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <>
          <li key="1" style={{ marginRight: "20px" }}>
            <i
              data-target="modal1"
              className="large material-icons modal-trigger"
              style={{ color: "black" }}
            >
              search
            </i>
          </li>
          ,
          <li key="2">
            <Link to="/profile">Profile</Link>
          </li>
          ,
          <li key="3">
            <Link to="/create">Create Post</Link>
          </li>
          <li key="4">
            <Link to="/myfollowingposts">my following posts</Link>
          </li>
          ,
          <li key="5">
            <button
              className="btn waves-effect waves-light #64b5ff6 blue darken-1 "
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
            >
              Logout
            </button>
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <li key="6">
            <Link to="/login">Login</Link>
          </li>
          <li key="7">
            <Link to="/signup">SignUp</Link>
          </li>
        </>,
      ];
    }
  };

  const fetchUser = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserDetails(result.user);
      });
  };

  return (
    <React.Fragment>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right ">
            {renderList()}
          </ul>
        </div>
        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              value={search}
              onChange={(e) => fetchUser(e.target.value)}
              placeholder="search user. . . "
            />

            <ul className="collection">
              {userDetails.map((item) => {
                return (
                  <Link
                    to={
                      item._id !== state._id
                        ? "/profile/" + item._id
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                    }}
                  >
                    <li className="collection-item">{item.email}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => setSearch("")}
            >
              Close
            </button>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};
export default Navbar;
