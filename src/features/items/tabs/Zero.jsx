import { VStack, Heading, SimpleGrid, Box, Text } from "@hope-ui/solid";
import { createSignal, createMemo } from "solid-js";

// Подключение к API для получения данных
const fetchData = async () => {
  const response = await fetch("/api/entries"); // Замените на ваш реальный endpoint
  const data = await response.json();
  return data;
};

export default function Zero() {
  const [entries, setEntries] = createSignal([]);

  // Загрузка данных при монтировании компонента
  const loadEntries = async () => {
    const data = await fetchData();
    setEntries(data);
  };

  loadEntries();  // Вызываем функцию загрузки данных

  const stats = createMemo(() => {
    const now = new Date();
    const all = entries();
    const onHands = all.filter((e) => !e.returnedAt).length;
    const overdue = all.filter((e) => !e.returnedAt && new Date(e.takenAt).getTime() + 30 * 86400000 < now.getTime()).length;
    const returned = all.filter((e) => e.returnedAt).length;

    return {
      total: all.length,
      onHands,
      overdue,
      returned,
    };
  });

  return (
    <VStack w="$full" px="$7" py="$5" gap="$6" alignItems="start">
      <Heading size="lg" color="$accent11">Статистика библиотекаря</Heading>

      <SimpleGrid columns={{ "@initial": 1, "@md": 2 }} gap="$4" w="$md">
        <StatCard label="Всего книг" value={stats().total} color="gray" icon="📚" />
        <StatCard label="Выдано" value={stats().onHands} color="orange" icon="📖" />
      </SimpleGrid>

      <SimpleGrid columns={1} gap="$4" w="$md">
        <StatCard label="Просрочено" value={stats().overdue} color="red" icon="⏳" />
        <StatCard label="Возвращено" value={stats().returned} color="green" icon="✔️" />
      </SimpleGrid>
    </VStack>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <Box p="$5" borderRadius="$2xl" bgColor="white" boxShadow="$md">
      <Text fontSize="sm" color="$neutral10" mb="$2" display="flex" alignItems="center">
        <span style={{ fontSize: "1.5em", marginRight: "10px" }}>{icon}</span> {label}
      </Text>
      <Text fontSize="2xl" color={`$${color}10`} fontWeight="$bold">{value}</Text>
    </Box>
  );
}





