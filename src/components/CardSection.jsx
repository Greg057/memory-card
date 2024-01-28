import { useState, useEffect } from "react"
import Card from "./Card"
import { v4 as uuidv4 } from 'uuid';


export default function CardSection () {
    const NUMBER_POKEMONS = 10
    const [pokemons, setPokemons] = useState([])

    async function setUpPokemons (dataArr) {
        const newPokemon = await Promise.all(dataArr.map(async pokemon => {
            const pokemonImage = pokemon.sprites.front_default
            const pokemonId = pokemon.game_indices[0].game_index
            let pokemonName = pokemon.name.replace("-", " ")
            pokemonName = pokemonName[0].toUpperCase() + pokemonName.slice(1)
            return {id: pokemonId, name: pokemonName, image: pokemonImage}
        }))
        setPokemons(newPokemon)
    }

    useEffect(() => {
        async function fetchPokemons () {
            const dataArr = []
            const promises = [];
            const IDs = []
            const totalNumberPokemons = 493 //until Generation IV included
           
                for (let i = 0; i < NUMBER_POKEMONS; i++) {
                    let uniqueId = false
                    let id
                    while (uniqueId !== true) {
                        id = Math.floor(Math.random() * totalNumberPokemons) + 1
                        if (!IDs.find(idElement => idElement === id)) {
                            uniqueId = true
                            IDs.push(id)
                        }
                    }
                    
                    const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(res => res.json())
                        .then(data => dataArr.push(data))
                    
                        promises.push(promise)
                }
                await Promise.all(promises)
                return dataArr
        }

        fetchPokemons().then(dataArr => setUpPokemons(dataArr))

    }, [])

    function shuffleArray () {
        const newPokemons = [...pokemons]
        for (let i = newPokemons.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [newPokemons[i], newPokemons[j]] = [newPokemons[j], newPokemons[i]];
        }
        newPokemons.forEach(pokemon => pokemon.id = uuidv4())
        setPokemons(newPokemons)
    }

    return (
        <div>
            {pokemons.length < NUMBER_POKEMONS ? <h2>Loading...</h2> : 
                <div className="card-section">
                    {pokemons.map((pokemon) =>
                        <Card pokemon={pokemon} key={pokemon.id} onClick={shuffleArray}/>
                    )}
                </div>
            }
        </div>
    )
}