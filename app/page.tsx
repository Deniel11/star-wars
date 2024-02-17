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
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [homeworldFilter, setHomeworldFilter] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchPeople = async () => {
      setIsLoading(true);
      try {
        const searchQuery = searchTerm ? `&search=${searchTerm}` : '';
        const response = await fetch(`https://swapi.dev/api/people/?page=${page}${searchQuery}`);
        const data = await response.json();

        const peopleWithDetails = await Promise.all(
          data.results.map(async (person: any) => {
            const homeworldResponse = await fetch(person.homeworld);
            const homeworldData: Planet = await homeworldResponse.json();

            const filmsData: Film[] = await Promise.all(
              person.films.map(async (film: string) => {
                const filmResponse = await fetch(film);
                return await filmResponse.json();
              })
            );

            const speciesData: Specie[] = await Promise.all(
              person.species.map(async (specie: string) => {
                const specieResponse = await fetch(specie);
                return await specieResponse.json();
              })
            );

            const starshipsData: Starship[] = await Promise.all(
              person.starships.map(async (starship: string) => {
                const starshipResponse = await fetch(starship);
                return await starshipResponse.json();
              })
            );

            const vehiclesData: Vehicle[] = await Promise.all(
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

        const filteredPeople = peopleWithDetails.filter((person: Person | null) => {
          if (!person) return false;
          return (
            (!genderFilter || person.gender.toLowerCase() === genderFilter.toLowerCase()) &&
            (!homeworldFilter || person.homeworld.name.toLowerCase() === homeworldFilter.toLowerCase())
          );
        });

        setPeople(peopleWithDetails);
        setFilteredPeople(filteredPeople);
        setTotalPages(data.count > 0 ? Math.ceil(data.count / 10) : 0); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeople();
  }, [page, searchTerm, genderFilter, homeworldFilter]);

  const handlePageChange = (newPage : any) => {
    setPage(newPage.selected + 1);
    setGenderFilter(null);
    setHomeworldFilter(null);
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    if (newSearchTerm !== searchTerm) {
      setSearchTerm(newSearchTerm);
      setGenderFilter(null);
      setHomeworldFilter(null);
    }
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
      <div className='search-container'>
        <input
          className='search-input'
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className='filters'>
  <label>
    Gender:
    <select
      value={genderFilter || ''}
      onChange={(e) => setGenderFilter(e.target.value || null)}
    >
      <option value="">All</option>
      {Array.from(new Set(people.map(p => p.gender))).map((gender, index) => (
        <option key={index} value={gender}>
          {gender}
        </option>
      ))}
    </select>
  </label>
  <label>
    Homeworld:
    <select
      value={homeworldFilter || ''}
      onChange={(e) => setHomeworldFilter(e.target.value || null)}
    >
      <option value="">All</option>
      {Array.from(new Set(people.map(p => p.homeworld.name))).map((homeworld, index) => (
        <option key={index} value={homeworld}>
          {homeworld}
        </option>
      ))}
    </select>
  </label>
</div>
      </div>
      {isLoading ? (<Loader />) : (
        <div id="galery">
            {filteredPeople.map(p =>
            <div className='personCard' key={p.url.split('/')[5]}>
                <a onClick={() => handlePersonClick(p)}>
                    <img src={"people/"+ p.url.split('/')[5] + ".jpg"}></img>
                    <p>{p.name}</p>
                </a>
            </div>)}
        </div>
      )}
        <ReactPaginate
          className='react-paginate'
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageChange}
          pageCount={totalPages}
          previousLabel="Previous"
        />
    </div>

    <CharacterDetails person={selectedPerson} onClose={handleCloseModal} />
    </>
  )
}

export default Home
