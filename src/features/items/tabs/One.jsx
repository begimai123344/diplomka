import {
  VStack, HStack, Heading, Box, SimpleGrid, Button,
  Table, Thead, Tbody, Tr, Th, Td, Input, IconButton, List, ListItem
} from "@hope-ui/solid";
import { createSignal, For, onMount } from "solid-js";
import { HiOutlinePencil, HiOutlineTrash } from "solid-icons/hi";

// Расширенные значения для селектов
const directionsList = [
  "Литература", "Философия", "Роман", "Наука", "История", 
  "Психология", "Математика", "Биография", "Экономика"
];
const authorsList = [
  "Лев Толстой", "Джордж Оруэлл", "Михаил Булгаков", "Федор Достоевский", 
  "Виктор Гюго", "Маргарет Этвуд", "Уильям Шекспир", "Антуан де Сент-Экзюпери", 
  "Харуки Мураками", "Джейн Остин"
];
const titlesList = [
  "Война и мир", "1984", "Мастер и Маргарита", "Преступление и наказание",
  "Отверженные", "Гордость и предубеждение", "Убить пересмешника", "451 градус по Фаренгейту", 
  "На маяк", "Братья Карамазовы"
];

const BASE_URL = "http://176.126.164.165:8000/";
const TOKEN = localStorage.getItem('access_token');

const initialBooks = [
 
];

export default function One() {
  const [authors, setAuthors] = createSignal([]);
  const [directions, setDirections] = createSignal([]);
  const [publishers, setPublishers] = createSignal([]);

  const [authorId, setAuthorId] = createSignal(0);
  const [directionId, setDirectionId] = createSignal(0);
  const [publisherId, setPublisherId] = createSignal(0);

  const [books, setBooks] = createSignal([...initialBooks]);
  const [title, setTitle] = createSignal("");
  const [author, setAuthor] = createSignal("");
  const [publisher, setPublisher] = createSignal("");
  const [udk, setUdk] = createSignal("");
  const [direction, setDirection] = createSignal("");
  const [bbk, setBbk] = createSignal("");
  const [isbn, setIsbn] = createSignal("");
  const [quantity, setQuantity] = createSignal(1);

  onMount(() => {
    // load authors
    const loadAuthors = async () => {
      try {
        const response = await fetch(BASE_URL + "api/authors", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${TOKEN}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAuthors(data);
          console.log(authors());
        }
      } catch(error) {
        console.log(error);
      }
    }
    loadAuthors();

    // load directions
    const loadDirections = async () => {
      try {
        const response = await fetch(BASE_URL + "api/directions", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${TOKEN}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDirections(data);
        }
      } catch(error) {
        console.log(error);
      }
    }
    loadDirections();

    // load pusblishers
    const loadPublishers = async () => {
      try {
        const response = await fetch(BASE_URL + "api/publishers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${TOKEN}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPublishers(data);
        }
      } catch(error) {
        console.log(error);
      }
    }
    loadPublishers();
  })

  // Стейт для поиска
  const [searchTitle, setSearchTitle] = createSignal("");
  const [searchAuthor, setSearchAuthor] = createSignal("");
  const [searchDirection, setSearchDirection] = createSignal("");
  const [searchPublisher, setSearchPublisher] = createSignal("");

  // Стейт для отслеживания ошибок
  const [errors, setErrors] = createSignal({
    title: false,
    author: false,
    publisher: false,
    direction: false,
    quantity: false,
    udk: false,
    bbk: false,
    isbn: false,
  });

  const addBook = () => {
    // Проверка на незаполненные поля
    const newErrors = {
      title: !title(),
      author: !author(),
      publisher: !publisher(),
      direction: !direction(),
      quantity: quantity() <= 0,
      udk: !udk(),
      bbk: !bbk(),
      isbn: !isbn(),
    };
    
    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) return;  // Если есть ошибки, не добавляем книгу

    const generatedInventoryNumber = `INV-${Date.now()}`;
    const newBook = {
      id: Date.now(),
      title: title(),
      author: author(),
      publisher: publisher(),
      udk: udk(),
      direction: direction(),
      bbk: bbk(),
      isbn: isbn(),
      quantity: parseInt(quantity()),
      inventoryNumber: generatedInventoryNumber,
    };

    console.log(newBook);

    // setBooks([...books(), newBook]);

    // Очистка полей
    // setTitle(""); setAuthor(""); setPublisher(""); setUdk(""); setDirection(""); setBbk(""); setIsbn(""); setQuantity(1);
    // setSearchTitle("");
    // setSearchAuthor("");
    // setSearchDirection("");
    // setErrors({});  // Сброс ошибок
  };

  const deleteBook = (id) => {
    setBooks(books().filter((b) => b.id !== id));
  };

  const editBook = (id) => {
    const book = books().find((b) => b.id === id);
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setPublisher(book.publisher);
      setUdk(book.udk);
      setDirection(book.direction);
      setBbk(book.bbk);
      setIsbn(book.isbn);
      setQuantity(book.quantity);
      deleteBook(id);
    }
  };

  const getInputBorder = (fieldName) => {
    return errors()[fieldName] ? "2px solid red" : undefined;
  };



  const selectAuthor = () => {
    
  }


  return (
    <VStack w="$full" px="$7" py="$5" gap="$6" alignItems="start">
      <Heading size="lg" color="$accent11">Каталог книг</Heading>

      <Box w="$full" p="$4" borderRadius="$xl" boxShadow="$sm" bg="white">
        <Heading size="md" mb="$3">Добавить новую книгу</Heading>
        <SimpleGrid columns={{ "@initial": 1, "@md": 2 }} spacing="$6">

          <Box mb="$4">
            <label>Название книги</label>
            <Input
              placeholder="Название книги"
              value={searchTitle()}
              onInput={(e) => setSearchTitle(e.target.value)}
              list="titles-list"
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", border: getInputBorder("title") }}
            />
          </Box>

          <Box mb="$4">
            <label>Автор</label>
            <Input
              placeholder="Автор"
              value={searchAuthor()}
              onInput={(e) => setSearchAuthor(e.target.value)}
              list="authors-list"
              onChange={(e) => {setAuthor(e.target.value); selectAuthor()}}
              style={{ width: "100%", border: getInputBorder("author") }}
            />
            <datalist id="authors-list">
              <For each={
                authors()
                  .map(author => `${author.first_name} ${author.last_name}`)
                  .filter(name => name.toLowerCase().includes(searchDirection().toLowerCase()))
              }>
                {(fullName) => <option value={fullName} />}
              </For>
            </datalist>
          </Box>

          <Box mb="$4">
            <label>Издательство</label>
            <Input 
              placeholder="Издательство" 
              value={publisher()} 
              onInput={(e) => setSearchPublisher(e.target.value)}
              list="publishers-list"
              onChange={(e) => setPublisher(e.target.value)} 
              style={{ border: getInputBorder("publisher") }}
            />
            <datalist id="publishers-list">
              <For each={
                publishers()
                  .map(publisher => publisher.name)
                  .filter(name => name.toLowerCase().includes(searchPublisher().toLowerCase()))
              }>
                {(fullName) => <option value={fullName} />}
              </For>
            </datalist>
          </Box>

          <Box mb="$4">
            <label>УДК</label>
            <Input 
              placeholder="УДК" 
              value={udk()} 
              onInput={(e) => setUdk(e.target.value)} 
              style={{ border: getInputBorder("udk") }}
            />
          </Box>

          <Box mb="$4">
            <label>Направление</label>
            <Input
              placeholder="Направление"
              value={searchDirection()}
              onInput={(e) => setSearchDirection(e.target.value)}
              list="directions-list"
              onChange={(e) => setDirection(e.target.value)}
              style={{ width: "100%", border: getInputBorder("direction") }}
            />
            <datalist id="directions-list">
              <For each={
                directions()
                  .map(direction => direction.name)
                  .filter(name => name.toLowerCase().includes(searchAuthor().toLowerCase()))
              }>
                {(fullName) => <option value={fullName} />}
              </For>
            </datalist>
          </Box>

          <Box mb="$4">
            <label>ББК</label>
            <Input 
              placeholder="ББК" 
              value={bbk()} 
              onInput={(e) => setBbk(e.target.value)} 
              style={{ border: getInputBorder("bbk") }}
            />
          </Box>

          <Box mb="$4">
            <label>ISBN</label>
            <Input 
              placeholder="ISBN" 
              value={isbn()} 
              onInput={(e) => setIsbn(e.target.value)} 
              style={{ border: getInputBorder("isbn") }}
            />
          </Box>

          <Box mb="$4">
            <label>Количество</label>
            <Input
              type="number"
              min="1"
              placeholder="Количество"
              value={quantity()}
              onInput={(e) => setQuantity(e.target.value)}
              style={{ border: getInputBorder("quantity") }}
            />
          </Box>

        </SimpleGrid>

        <Button mt="$4" onClick={addBook} colorScheme="accent">Добавить книгу</Button>
      </Box>

      <Box w="$full">
        <SimpleGrid columns={{ "@initial": 1, "@md": 2 }} spacing="$4">
          <Box minHeight="100%" display="flex" flexDirection="column">
            <Table variant="simple" w="$full" flex="1">
              <Thead>
                <Tr>
                  <Th>Название</Th>
                  <Th>Автор</Th>
                  <Th>Издательство</Th>
                </Tr>
              </Thead>
              <Tbody>
                <For each={books()}>{(book) => (
                  <Tr>
                    <Td>{book.title}</Td>
                    <Td>{book.author}</Td>
                    <Td>{book.publisher}</Td>
                  </Tr>
                )}</For>
              </Tbody>
            </Table>
          </Box>

          <Box minHeight="100%" display="flex" flexDirection="column">
            <Table variant="simple" w="$full" flex="1">
              <Thead>
                <Tr>
                  <Th>УДК</Th>
                  <Th>Направление</Th>
                  <Th>ББК</Th>
                  <Th>ISBN</Th>
                  <Th>Кол-во</Th>
                  <Th>инв. №</Th>
                 
                </Tr>
              </Thead>
              <Tbody>
                <For each={books()}>{(book) => (
                  <Tr>
                    <Td>{book.udk}</Td>
                    <Td>{book.direction}</Td>
                    <Td>{book.bbk}</Td>
                    <Td>{book.isbn}</Td>
                    <Td>{book.quantity}</Td>
                    <Td>{book.inventoryNumber}</Td>
                    <Td>
                      <HStack spacing="$2">
                        <IconButton
                          aria-label="Редактировать"
                          icon={<HiOutlinePencil />}
                          size="sm"
                          colorScheme="accent"
                          onClick={() => editBook(book.id)}
                        />
                        <IconButton
                          aria-label="Удалить"
                          icon={<HiOutlineTrash />}
                          size="sm"
                          colorScheme="danger"
                          onClick={() => deleteBook(book.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                )}</For>
              </Tbody>
            </Table>
          </Box>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}











  