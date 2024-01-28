import { useState, useEffect } from "react"



export default function Card () {
    const NUMBER_POKEMONS = 10
    const [pokemons, setPokemons] = useState([])

    async function setUpPokemons (dataArr) {
        const newPokemon = await Promise.all(dataArr.map(async pokemon => {
            const pokemonImage = pokemon.sprites.front_default
            const id = pokemon.game_indices[0].game_index
            let name = (pokemon.name.includes("-") ? pokemon.name.replace("-", " ") : pokemon.name)
            name = name[0].toUpperCase() + name.slice(1)
            return {id: id, name: name, image: pokemonImage}
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

    return (
        <div>
            {pokemons.length < NUMBER_POKEMONS ? <h2>{pokemons.length}</h2> : 
                <div className="card-section">
                    {pokemons.map((pokemon, i) =>
                        <div key={i} className="pokemon">
                            <h3>{pokemon.name}</h3>
                            <img src={pokemon.image}/>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}