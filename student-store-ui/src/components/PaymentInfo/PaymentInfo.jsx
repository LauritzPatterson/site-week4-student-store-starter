import "./PaymentInfo.css";

export default function PaymentInfo({
  userInfo,
  setUserInfo,
  handleOnCheckout,
  isCheckingOut,
  error,
}) {
  return (
    <div className="PaymentInfo">
      <h3 className="">
        Payment Info{" "}
        <span className="button">
          <i className="material-icons md-48">monetization_on</i>
        </span>
      </h3>

      <div className="input-field">
        <label className="label">Student ID</label>
        <div className="control ">
          <input
            className="input"
            type="text"
            placeholder="Name"
            value={userInfo.name}
            onChange={(e) =>
              setUserInfo((u) => ({ ...u, name: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="input-field">
        <label className="label">Dorm Room Number</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Dorm"
            value={userInfo.dorm}
            onChange={(e) =>
              setUserInfo((u) => ({ ...u, dorm: e.target.value }))
            }
          />
        </div>
      </div>

      <p className="is-danger">{error}</p>

      <div className="field">
        <div className="control">
          <button
            className="button"
            disabled={isCheckingOut}
            onClick={handleOnCheckout}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
