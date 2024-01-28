export default function Card ({ pokemon, onClick }) {
    return (
        <div className="pokemon" onClick={onClick}>
            <img src={pokemon.image}/>
            <h3>{pokemon.name}</h3>
        </div>
    )
}