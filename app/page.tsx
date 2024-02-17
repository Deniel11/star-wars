'use client';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

interface Person {
  name : string;
  birth_year : string;
  eye_color : string;
  gender : string;
  hair_color : string;
  height : string;
  mass : string;
  skin_color : string;
  homeworld : Planet;
  films : Film[];
  species : Specie[];
  starships : Starship[];
  vehicles : Vehicle[];
  url : string;
  created : string;
  edited : string;
}

interface Planet {
  name: string;
}

interface Film {
  title: string;
}

interface Specie {
  name : string;
}

interface Vehicle {
  name : string;
}

interface Starship {
  name : string;
}

interface CharacterDetailsProps {
  person: Person | null;
  onClose: () => void;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ person, onClose }) => {
  if (!person) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={"people/"+ person.url.split('/')[5] + ".jpg"}></img>
        <h2>{person.name}</h2>
        <p><span className='name'>Year Of Birh:</span> <span className='data'>{person.birth_year}</span></p>
        <p><span className='name'>Eye color:</span> <span className='data'>{person.eye_color}</span></p>
        <p><span className='name'>Gender:</span> <span className='data'>{person.gender}</span></p>
        <p><span className='name'>Hair Color:</span> <span className='data'>{person.hair_color}</span></p>
        <p><span className='name'>Height:</span> <span className='data'>{person.height}</span></p>
        <p><span className='name'>Mass:</span> <span className='data'>{person.mass}</span></p>
        <p><span className='name'>Skin color:</span> <span className='data'>{person.skin_color}</span></p>
        <p><span className='name'>Homeworld:</span> <span className='data'>{person.homeworld.name}</span></p>
        <p className='name'>Films:</p>
        <ul className='data'>
          {person.films.map(f => <li key={f.title}>{f.title}</li>)}
        </ul>
        <p className='name'>Spieces:</p>
        <ul className='data'>
          {person.species.map(s => <li key={s.name}>{s.name}</li>)}
        </ul>
        <p className='name'>Starships:</p>
        <ul className='data'>
          {person.starships.map(s => <li key={s.name}>{s.name}</li>)}
        </ul>
        <p className='name'>Vehicles:</p>
        <ul className='data'>
          {person.vehicles.map(v => <li key={v.name}>{v.name}</li>)}
        </ul>
        <p><span className='name'>URL:</span> <span className='data'>{person.url}</span></p>
        <p><span className='name'>Created:</span> <span className='data'>{person.created}</span></p>
        <p><span className='name'>Edited:</span> <span className='data'>{person.edited}</span></p>
      </div>
    </div>
  );
};

const Loader: React.FC = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

const Home = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchPeople = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        const data = await response.json();

        // Fetch additional details for each person
        const peopleWithDetails = await Promise.all(
          data.results.map(async (person: any) => {
            const homeworldResponse = await fetch(person.homeworld);
            const homeworldData : Planet = await homeworldResponse.json();

            const filmsData : Film[] = await Promise.all(
              person.films.map(async (film: string) => {
                const filmResponse = await fetch(film);
                return await filmResponse.json();
              })
            );

            const speciesData : Specie[] = await Promise.all(
              person.species.map(async (specie: string) => {
                const specieResponse = await fetch(specie);
                return await specieResponse.json();
              })
            );

            const starshipsData : Starship[] = await Promise.all(
              person.starships.map(async (starship: string) => {
                const starshipResponse = await fetch(starship);
                return await starshipResponse.json();
              })
            );

            const vehiclesData : Vehicle[] = await Promise.all(
              person.vehicles.map(async (vehicle: string) => {
                const vehicleResponse = await fetch(vehicle);
                return await vehicleResponse.json();
              })
            );
            
            return {
              ...person,
              homeworld: homeworldData,
              films: filmsData,
              species: speciesData,
              starships: starshipsData,
              vehicles: vehiclesData,
            };
          })
        );

        setPeople(peopleWithDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        console.log(people);
        
      }
    };

    fetchPeople();
  }, [page]);

  const handlePageChange = (newPage : any) => {
    setPage(newPage.selected + 1);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
  };

  return (
    <>
    <div>
      {isLoading && <Loader />}
        <div id="galery">
            {people.map(p =>
            <div className='personCard' key={p.url.split('/')[5]}>
                <a onClick={() => handlePersonClick(p)}>
                    <img src={"people/"+ p.url.split('/')[5] + ".jpg"}></img>
                    <p>{p.name}</p>
                </a>
            </div>)}
        </div>

        {/* Pagination */}
        <ReactPaginate
          className='react-paginate'
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageChange}
          pageCount={9}
          previousLabel="Previous"
        />
    </div>

    <CharacterDetails person={selectedPerson} onClose={handleCloseModal} />
    </>
  )
}

export default Home
