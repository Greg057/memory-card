import { useState, useEffect } from "react"



export default function Card () {
    const NUMBER_POKEMONS = 10
    const [pokemons, setPokemons] = useState([])

    async function setUpPokemons (dataArr) {
        const newPokemon = await Promise.all(dataArr.map(async pokemon => {
            const pokemonImage = await getPokemonImage(pokemon.url)
            const id = pokemon.url[pokemon.url.length - 1] === "/" ? pokemon.url.slice(pokemon.url.length - 4).slice(0,3) : pokemon.url.slice(pokemon.url.length - 3)
            console.log(id)
            let name = (pokemon.name.includes("-") ? pokemon.name.replace("-", " ") : pokemon.name)
            name = name[0].toUpperCase() + name.slice(1)
            return {name: name, image: pokemonImage}
        }))
        setPokemons(newPokemon)
    }

    function getPokemonImage (url) { 
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => res.json())
                .then(data => resolve(data.sprites.front_default))
                .catch(err => reject(err))
        })
    }

    useEffect(() => {
        async function fetchPokemons () {
            const dataArr = []
            const promises = [];
            const totalNumberPokemons = 493 //until Generation IV included
           
                for (let i = 0; i < NUMBER_POKEMONS; i++) {
                    let id = Math.floor(Math.random() * totalNumberPokemons) + 1
                    const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                        .then(res => res.json())
                        .then(data => dataArr.push(data.forms[0]))
                    
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