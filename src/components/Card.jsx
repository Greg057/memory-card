import { useState, useEffect } from "react"

export default function Card () {
    const [pokemons, setPokemons] = useState()

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=5")
            .then(res => res.json())
            .then(data => fetch(data.results[0].url))
            .then(res => res.json())
            .then(data => setPokemons(data.sprites.front_default))
            
    }, [])

    return (
        <img src={pokemons}/>
    )
}