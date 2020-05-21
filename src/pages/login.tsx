import { useRef, useState } from "react";
import Router from "next/router";

export default function Login() {
  const passRef = useRef(null);
  const [invalid, setInvalid] = useState(false);
  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const password = passRef.current.value;
          fetch("/api/login", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
          }).then((response) => {
            if (response.ok) {
              Router.push("/admin");
            } else {
              setInvalid(true);
            }
          });
          return false;
        }}
      >
        <div className="form-group">
          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="form-control"
            name="password"
            required
            ref={passRef}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div>{invalid && "Invalid Password!"}</div>
      </form>
    </div>
  );
}
