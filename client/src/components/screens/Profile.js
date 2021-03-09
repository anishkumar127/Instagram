import React, { useEffect, useState, useContext } from "react";

import { UserContext } from "../../App";
const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Instagram");
      data.append("cloud_name", "anishbishnoi");
      fetch("https://api.cloudinary.com/v1_1/anishbishnoi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUrl(data.url);

          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, pic: data.url })
          );
          dispatch({ type: "UPDATEPIC", payload: data.url });
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <React.Fragment>
      <div style={{ maxWidth: "550px", margin: "0px auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "18px 0px",
            borderBottom: "1px solid grey",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={state ? state.pic : "loading. . ."}
                alt="personImg"
              />

              <div
                className="file-field input-field"
                style={{ margin: "10px" }}
              >
                <div className="btn">
                  <span>Update Image</span>
                  <input
                    type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
                {/* <button
                  className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                  style={{ margin: "10px 0px 10px 25px" }}
                  onClick={() => {
                    updatePhoto();
                  }}
                >
                  Update Pic
                </button> */}
              </div>
            </div>
          </div>
          <div>
            <h4>{state ? state.name : "loading. . ."}</h4>
            <h5>{state ? state.email : "loading. . ."}</h5>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h5>{mypics.length}posts</h5>
              <h5>{state ? state.followers.length : "0"}followers</h5>

              <h5>{state ? state.following.length : "0"} following</h5>
            </div>
          </div>
        </div>

        <div className="gallery">
          {mypics.map((item) => {
            return (
              <img
                key={item._id}
                className="item"
                src={item.photo}
                alt={item.title}
              />
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
