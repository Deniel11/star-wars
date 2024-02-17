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
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!person) {
    return null;
  }

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={`people/${person.url.split('/')[5]}.jpg`} alt={person.name}></img>
        <h2>{person.name}</h2>
        {renderDetail("Year Of Birth", person.birth_year)}
        {renderDetail("Eye color", person.eye_color)}
        {renderDetail("Gender", person.gender)}
        {renderDetail("Hair Color", person.hair_color)}
        {renderDetail("Height", person.height)}
        {renderDetail("Mass", person.mass)}
        {renderDetail("Skin color", person.skin_color)}
        {renderDetail("Homeworld", person.homeworld.name)}
        {renderList("Films", person.films, (f) => f.title)}
        {renderList("Species", person.species, (s) => s.name)}
        {renderList("Starships", person.starships, (s) => s.name)}
        {renderList("Vehicles", person.vehicles, (v) => v.name)}
        {renderDetail("URL", person.url)}
        {renderDetail("Created", person.created)}
        {renderDetail("Edited", person.edited)}
      </div>
    </div>
  );

  function renderDetail(label: string, value: string) {
    return (
      <p>
        <span className="name">{label}:</span> <span className="data">{value}</span>
      </p>
    );
  }

  function renderList(label: string, list: any[], getItem: (item: any) => string) {
    return (
      <div>
        <p className="name">{label}:</p>
        <ul className="data">
          {list.map((item, index) => (
            <li key={index}>{getItem(item)}</li>
          ))}
        </ul>
      </div>
    );
  }
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
  const [isSearching, setIsSearching] = useState<boolean>(false);
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
        setIsSearching(false);
      }
    };

    fetchPeople();
  }, [page, searchTerm, genderFilter, homeworldFilter]);

  const handlePageChange = (newPage : any) => {    
    setPage(newPage.selected + 1);
    setGenderFilter(null);
    setHomeworldFilter(null);
    if (!searchTerm) {
      setSearchTerm('');
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    if (newSearchTerm !== searchTerm) {
      setIsSearching(true);
      setPage(1);
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
          {renderFilterSelect("Gender", people.map(p => p.gender), genderFilter, setGenderFilter)}
          {renderFilterSelect("Homeworld", people.map(p => p.homeworld.name), homeworldFilter, setHomeworldFilter)}
        </div>
      </div>
      {isLoading ? (<Loader />) : (
        <div id="gallery">
            {filteredPeople.map(p =>
            <div className='personCard' key={p.url.split('/')[5]}>
                <a onClick={() => handlePersonClick(p)}>
                    <img src={`people/${p.url.split('/')[5]}.jpg`} alt={p.name}></img>
                    <p>{p.name}</p>
                </a>
            </div>)}
        </div>
      )}
      {isSearching ? ("") : (
        <ReactPaginate
          className='react-paginate'
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageChange}
          pageCount={totalPages}
          previousLabel="Previous"
        />
      )}
    </div>

    <CharacterDetails person={selectedPerson} onClose={handleCloseModal} />
    </>
  );

  function renderFilterSelect(label: string, options: string[], selectedValue: string | null, onChange: (value: string | null) => void) {
    return (
      <label>
        {label}:
        <select
          value={selectedValue || ''}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">All</option>
          {Array.from(new Set(options)).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }
};

export default Home;
