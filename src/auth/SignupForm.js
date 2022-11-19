import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import FootyApi from "../api/api";

/** Signup form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to /X route
 *
 * Routes -> SignupForm -> Alert
 * Routed as /signup
 */

function SignupForm({ signup }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    continent: "",
    city: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [cities, setCities] = useState([]);

  console.debug(
      "SignupForm",
      "signup=", typeof signup,
      "formData=", formData,
      "formErrors=", formErrors,
  );

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /companies.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signup(formData);
    if (result.success) {
      history.push("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  async function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
    console.log(name, value);
    if (name === "continent") {
      if (value !== "") {
        const citiesRes = await FootyApi.getCities(value);
        const citiesArr = citiesRes.map(city => city.city);
        // setFormData(data => ({ ...data, cities: citiesArr }));
        setCities(cities => citiesArr);
        console.log("cities", citiesArr);
      } else {
        // setFormData(data => ({ ...data, cities: [] }));
        setCities(cities => []);
        console.log("cities", []);
      }
    }
  }

  return (
      <div className="SignupForm">
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <h2 className="mb-3">Sign Up</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                
                <div className="form-group">
                  <label>Username</label>
                  <input
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                  />
                </div>

                <h4>Timezone</h4>
                <div className="form-group">
                  <label>Continent</label>
                  <select
                    name="continent"
                    className="form-control"
                    value={formData.continent}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="Africa">Africa</option>
                    <option value="America">America</option>
                    <option value="Antarctica">Antarctica</option>
                    <option value="Arctic">Arctic</option>
                    <option value="Asia">Asia</option>
                    <option value="Atlantic">Atlantic</option>
                    <option value="Australia">Australia</option>
                    <option value="Europe">Europe</option>
                    <option value="Indian">Indian</option>
                    <option value="Pacific">Pacific</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  <select
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option defaultValue disabled>Choose...</option>
                    {cities.map(city => 
                      <option value={city} key={city}>{city}</option>
                    )}
                  </select>
                </div>

                {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }

                <button
                    type="submit"
                    className="btn btn-primary float-right"
                    onSubmit={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default SignupForm;