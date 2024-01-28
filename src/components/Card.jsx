import { useState, useEffect } from "react"

export default function Card () {
    const [pokemons, setPokemons] = useState()

    async function setUpPokemons (data) {
        const pokemonArray = await Promise.all(data.map(async pokemon => {
            const pokemonImage = await getPokemonImage(pokemon.url)
            return {name: pokemon.name, image: pokemonImage}
        }))
        setPokemons(pokemonArray)
    }

    function getPokemonImage (url) { 
        return new Promise(resolve => {
            fetch(url)
                .then(res => res.json())
                .then(data => resolve(data.sprites.front_default))
        })
    }

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=5")
            .then(res => res.json())
            .then(data => setUpPokemons(data.results))           
    }, [])

    return (
        <div>
            {!pokemons ? <h2>Loading...</h2> : 
                pokemons.map((pokemon, i) => 
                    <div key={i} className="pokemon">
                        <h3>{pokemon.name}</h3>
                        <img src={pokemon.image}/>
                    </div>
                )
            }
            
        </div>
    )
}