import { useState, useEffect } from "react"

export default function Card () {
    const [pokemons, setPokemons] = useState()

    function setUpPokemons (data) {
        const pokemonsArray = data.map(async pokemon => {
            const pokemonImage = await getPokemonImage(pokemon.url)
            console.log(pokemonImage)
            return {name: pokemon.name, image: pokemonImage}
        })
        setPokemons(pokemonsArray)
        console.log(pokemons)
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
        <p>hi</p>
    )
}