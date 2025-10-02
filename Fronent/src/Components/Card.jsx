import "../assets/Styles/Card.css";

function Card({ title, description, icon, onClick }) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onClick}>Ingresar</button>
    </div>
  );
}

export default Card;



